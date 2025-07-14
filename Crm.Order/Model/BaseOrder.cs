namespace Crm.Order.Model
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using Crm.Article.Model.Enums;
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Model;
	using Crm.Model;
	using Crm.Model.Lookups;
	using Crm.Order.Model.Lookups;

	public abstract class BaseOrder : EntityBase<Guid>, ISoftDelete, IEntityWithVisibility, IExportable
	{
		public virtual string LegacyId { get; set; }
		public virtual string OrderNo { get; set; }
		public virtual string DocumentNo { get; set; }
		public virtual Guid? ContactId { get; set; }
		public virtual string ContactName { get; set; }
		public virtual Guid? ContactAddressId { get; set; }
		public virtual string ContactAddressStreet { get; set; }
		public virtual string ContactAddressZipCode { get; set; }
		public virtual string ContactAddressCity { get; set; }
		public virtual Guid? DeliveryAddressId { get; set; }
		public virtual string DeliveryAddressName { get; set; }
		public virtual string DeliveryAddressStreet { get; set; }
		public virtual string DeliveryAddressZipCode { get; set; }
		public virtual string DeliveryAddressCity { get; set; }
		public virtual Guid? BillingAddressId { get; set; }
		public virtual string BillingAddressName { get; set; }
		public virtual string BillingAddressStreet { get; set; }
		public virtual string BillingAddressZipCode { get; set; }
		public virtual string BillingAddressCity { get; set; }
		public virtual string Signature { get; set; }
		public virtual DateTime? SignatureDate { get; set; }
		public virtual string SignatureName { get; set; }
		public virtual bool SignPrivacyPolicyAccepted { get; set; }
		public virtual DateTime OrderDate { get; set; }
		public virtual DateTime? DeliveryDate { get; set; }
		public virtual DateTime? ExportDate { get; set; }
		public virtual string StatusKey { get; set; }
		public virtual string OrderCategoryKey { get; set; }
		public virtual string OrderCategoryName
		{
			get { return OrderCategory != null ? OrderCategory.Value : ""; }
		}
		public virtual string OrderCategoryColor
		{
			get { return OrderCategory != null ? OrderCategory.Color : ""; }
		}
		public virtual OrderCategory OrderCategory
		{
			get { return OrderCategoryKey != null ? LookupManager.Get<OrderCategory>(OrderCategoryKey) : null; }
		}
		public virtual string CustomFax { get; set; }
		public virtual string CustomEmail { get; set; }
		public virtual string CommunicationType { get; set; }

		public virtual Guid? ContactPersonId { get; set; }
		public virtual Person ContactPerson { get; set; }

		public virtual bool SendConfirmation { get; set; }
		public virtual string ConfirmationSendingError { get; set; }
		public virtual bool ConfirmationSent { get; set; }
		public virtual OrderCommunicationData SendConfirmationTo
		{
			get
			{
				string data;
				string type;
				var title = ContactPerson?.ToString() ?? String.Empty;
				var hasEmail = !String.IsNullOrEmpty(CustomEmail);
				data = hasEmail ? CustomEmail : CustomFax;
				type = hasEmail ? "email" : "fax";
				return new OrderCommunicationData
				{
					Data = data,
					Title = title,
					Type = type
				};
			}
		}

		public virtual bool DeliveryProhibited
		{
			get { return Company != null && Company.ErpDeliveryProhibited; }
		}

		public virtual Company Company { get; set; }
		public virtual string SalesRepresentative
		{
			get { return Company != null ? Company.SalesRepresentative : ""; }
		}

		public virtual OrderStatus Status
		{
			get { return StatusKey != null ? LookupManager.Get<OrderStatus>(StatusKey) : null; }
		}
		public virtual string ResponsibleUser { get; set; }
		public virtual User ResponsibleUserObject { get; set; }
		public virtual string Representative { get; set; }
		public virtual decimal Price { get; set; }
		public virtual decimal CalculatedPrice
		{
			get { return Items.Count > 0 ? Items.Select(x => x.CalculatedPriceWithDiscount).Sum() : 0; }
		}
		public virtual decimal CalculatedPriceWithDiscount
		{
			get { return CalculatedPrice - RealizedDiscount; }
		}
		public virtual string CurrencyKey { get; set; }
		public virtual Currency Currency
		{
			get { return CurrencyKey != null ? LookupManager.Get<Currency>(CurrencyKey) : null; }
		}
		public virtual decimal Discount { get; set; }
		public virtual decimal RealizedDiscount
		{
			get
			{
				if (DiscountType == DiscountType.Percentage)
				{
					return CalculatedPrice * (Discount / 100);
				}
				return Discount;
			}
		}
		public virtual DiscountType DiscountType { get; set; }
		public virtual string DiscountText
		{
			get
			{
				var discount = Discount == 0 ? "" : String.Format("{0:n}", Discount);
				return String.IsNullOrWhiteSpace(discount) ? "" :
					DiscountType == DiscountType.Percentage
						? discount + "%"
						: discount;
			}
		}
		//The description that the customer sees
		public virtual string PublicDescription { get; set; }
		//The description that only the users of the CRM see
		public virtual string PrivateDescription { get; set; }
		public virtual string CustomerOrderNumber { get; set; }
		public virtual string Comission { get; set; }
		public virtual bool IsExported { get; set; }
		public virtual bool ReadyForExport { get; set; }
		public virtual string OrderEntryType { get; set; }
		public virtual string OrderType
		{
			get { return this is Order ? "Order" : "Offer"; }
		}

		public virtual ICollection<CalculationPosition> CalculationPositions { get; set; }
		public virtual ICollection<OrderItem> Items { get; set; }

		public virtual Visibility Visibility { get; set; }
		public virtual ICollection<Guid> VisibleToUsergroupIds { get; set; }
		public virtual ICollection<string> VisibleToUserIds { get; set; }

		// Constructor
		public BaseOrder()
		{
			CalculationPositions = new List<CalculationPosition>();
			Items = new List<OrderItem>();
			StatusKey = "Open";
			Visibility = Visibility.Everybody;
		}

		public BaseOrder(Company company, string responsibleUser)
			: this()
		{
			ContactId = company.Id;
			ContactName = company.Name;
			var standardAddress = company.StandardAddress ?? company.Addresses.First();
			ContactAddressId = standardAddress.Id;
			ContactAddressStreet = standardAddress.Street;
			ContactAddressZipCode = standardAddress.ZipCode;
			ContactAddressCity = standardAddress.City;
			ResponsibleUser = responsibleUser;
		}
	}
}
