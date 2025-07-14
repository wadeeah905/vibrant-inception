namespace Crm.Order.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Net.Mail;
	using System.Net.Mime;

	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.Interfaces;
	using Crm.Library.Services.Interfaces;
	using Crm.Library.ViewModels;
	using Crm.Model;
	using Crm.Order.Interfaces;
	using Crm.Order.Model;
	using Crm.Order.Services.Interfaces;
	using Crm.Services;
	using Crm.Services.Interfaces;

	public class BaseOrderService : IBaseOrderService, IMerger<Contact>
	{
		private readonly IRepositoryWithTypedId<BaseOrder, Guid> orderRepository;
		private readonly IRepositoryWithTypedId<CalculationPosition, Guid> calculationPositionRepository;
		private readonly ICompanyService companyService;
		private readonly IAddressService addressService;
		private readonly IEnumerable<IOrderCommunicationDataTransformer> orderCommunicationDataTransformers;
		private readonly IPdfService pdfService;
		private readonly IRenderViewToStringService renderViewToStringService;
		private readonly IResourceManager resourceManager;
		private readonly IUserService userService;
		private readonly Func<Message> messageFactory;
		private readonly IRepositoryWithTypedId<Message, Guid> messageRepository;
		private readonly IFileService fileService;

		private readonly IAuthorizationManager authorizationManager;

		// Methods
		public virtual BaseOrder GetOrder(Guid id)
		{
			return orderRepository.Get(id);
		}
		public virtual void SaveOrder(BaseOrder baseOrder, bool? close = null)
		{
			SetAddressData(baseOrder);
			orderRepository.SaveOrUpdate(baseOrder);
		}

		public virtual void DeleteOrder(Guid id)
		{
			var order = orderRepository.Get(id);
			DeleteOrder(order);
		}

		public virtual void DeleteOrder(BaseOrder baseOrder)
		{
			baseOrder.IsActive = false;
			orderRepository.SaveOrUpdate(baseOrder);
		}

		public virtual void SetAddressData(BaseOrder baseOrder)
		{
			var company = baseOrder.ContactId.HasValue ? companyService.GetCompany(baseOrder.ContactId.Value) : null;
			baseOrder.ContactName = company?.Name;
			if (company?.StandardAddress != null)
			{
				baseOrder.ContactAddressStreet = company.StandardAddress.Street;
				baseOrder.ContactAddressZipCode = company.StandardAddress.ZipCode;
				baseOrder.ContactAddressCity = company.StandardAddress.City;
			}

			var deliveryAddress = baseOrder.DeliveryAddressId.HasValue ? addressService.GetAddress(baseOrder.DeliveryAddressId.Value) : company?.StandardAddress;
			if (deliveryAddress != null)
			{
				baseOrder.DeliveryAddressName = deliveryAddress.Name1;
				baseOrder.DeliveryAddressStreet = deliveryAddress.Street;
				baseOrder.DeliveryAddressZipCode = deliveryAddress.ZipCode;
				baseOrder.DeliveryAddressCity = deliveryAddress.City;
			}

			var billAddress = baseOrder.BillingAddressId.HasValue ? addressService.GetAddress(baseOrder.BillingAddressId.Value) : company?.StandardAddress;
			if (billAddress != null)
			{
				baseOrder.BillingAddressName = billAddress.Name1;
				baseOrder.BillingAddressStreet = billAddress.Street;
				baseOrder.BillingAddressZipCode = billAddress.ZipCode;
				baseOrder.BillingAddressCity = billAddress.City;
			}
		}

		public virtual bool TrySendMail(BaseOrder order)
		{
			var orderCommunicationData = order.SendConfirmationTo;
			orderCommunicationDataTransformers.ForEach(transformer => orderCommunicationData = transformer.TransformData(order, orderCommunicationData));
			if (orderCommunicationData.Handled || orderCommunicationData.Data == null)
			{
				return false;
			}

			var message = messageFactory();
			var entityType = order.OrderType == "Offer" ? "Offer" : "Order";
			if (userService.CurrentUser != null)
			{
				message.From = new MailAddress(userService.CurrentUser.Email, userService.CurrentUser.DisplayName).ToString();
			}
			message.Subject = $"{resourceManager.GetTranslation(entityType)}-{order.OrderNo}";
			message.Body = string.Format(resourceManager.GetTranslation($"DetailsFor{entityType}"), order.OrderNo);
			message.Recipients.Add(orderCommunicationData.Data);
			message.AttachmentIds.Add(fileService.CreateAndSaveFileResource(CreatePdf(order), MediaTypeNames.Application.Pdf, message.Subject + ".pdf").Id);
			messageRepository.SaveOrUpdate(message);
			return true;
		}

		public virtual void Merge(Contact loser, Contact winner)
		{
			var loserOrders = orderRepository.GetAll().Where(x => x.ContactId == loser.Id);
			foreach (var loserOrder in loserOrders)
			{
				loserOrder.ContactId = winner.Id;
				orderRepository.SaveOrUpdate(loserOrder);
			}
		}
		
		public virtual bool OrderCanBeEditedByUser(User user, BaseOrder order)
		{
			if (order is Order)
			{
				return user.Id == order.CreateUser || user.Id == order.ResponsibleUser || authorizationManager.IsAdministrator(user) || authorizationManager.IsAuthorizedForAction(user, OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SeeAllUsersOrders);
			}
			return user.Id == order.CreateUser || user.Id == order.ResponsibleUser || authorizationManager.IsAdministrator(user) || authorizationManager.IsAuthorizedForAction(user, OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.SeeAllUsersOffers);
		}

		// Constructor
		public BaseOrderService(IRepositoryWithTypedId<BaseOrder, Guid> orderRepository, IRepositoryWithTypedId<CalculationPosition, Guid> calculationPositionRepository, ICompanyService companyService, IAddressService addressService, IEnumerable<IOrderCommunicationDataTransformer> orderCommunicationDataTransformers, IUserService userService, IResourceManager resourceManager, IRenderViewToStringService renderViewToStringService, IPdfService pdfService, IAuthorizationManager authorizationManager, IRepositoryWithTypedId<Message, Guid> messageRepository, Func<Message> messageFactory, IFileService fileService)
		{
			this.orderRepository = orderRepository;
			this.companyService = companyService;
			this.addressService = addressService;
			this.orderCommunicationDataTransformers = orderCommunicationDataTransformers;
			this.userService = userService;
			this.resourceManager = resourceManager;
			this.renderViewToStringService = renderViewToStringService;
			this.pdfService = pdfService;
			this.authorizationManager = authorizationManager;
			this.calculationPositionRepository = calculationPositionRepository;
			this.messageFactory = messageFactory;
			this.messageRepository = messageRepository;
			this.fileService = fileService;
		}

		public virtual void SetExportedFlag(Guid orderId)
		{
			var order = GetOrder(orderId);
			order.IsExported = true;
			orderRepository.SaveOrUpdate(order);
		}
		public virtual byte[] CreatePdf(BaseOrder baseOrder)
		{
			var offer = baseOrder as Offer;
			if (offer != null)
			{
				var model = new HtmlTemplateViewModel { Id = offer.Id, ViewModel = "Crm.Order.ViewModels.OfferPdfModalViewModel" };
				return CreatePdf(offer, "OfferPdf", model);
			}

			var order = baseOrder as Order;
			if (order != null)
			{
				var model = new HtmlTemplateViewModel { Id = order.Id, ViewModel = "Crm.Order.ViewModels.OrderPdfModalViewModel" };
				return CreatePdf(order, "OrderPdf", model);
			}

			throw new ArgumentException($"Unknown BaseOrder type {baseOrder.GetType().FullName}");
		}
		public virtual byte[] CreatePdf(BaseOrder baseOrder, string view, object model)
		{
			var html = renderViewToStringService.RenderViewToString("Crm.Order", "BaseOrder", view, model);
			var pdf = pdfService.Html2Pdf(html);
			return pdf;
		}
		public virtual byte[] CreatePdf(Offer offer)
		{
			return CreatePdf((BaseOrder)offer);
		}
		public virtual byte[] CreatePdf(Order order)
		{
			return CreatePdf((BaseOrder)order);
		}

		public virtual IEnumerable<string> GetUsedCalculationPositionTypes()
		{
			return calculationPositionRepository.GetAll().Select(c => c.CalculationPositionTypeKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedOrderCategories()
		{
			return orderRepository.GetAll().Select(c => c.OrderCategoryKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedOrderStatuses()
		{
			return orderRepository.GetAll().Select(c => c.StatusKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedCurrencies()
		{
			return orderRepository.GetAll().Select(c => c.CurrencyKey).Distinct();
		}
	}
}
