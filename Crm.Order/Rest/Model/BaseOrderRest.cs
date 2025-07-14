namespace Crm.Order.Rest.Model
{
	using System;

	using Crm.Article.Model.Enums;
	using Crm.Library.Api.Attributes;
	using Crm.Library.BaseModel;
	using Crm.Library.Rest;
	using Crm.Order.Model;
	using Crm.Rest.Model;

	[RestTypeFor(DomainType = typeof(BaseOrder))]
	public class BaseOrderRest : RestEntityWithExtensionValues
	{
		[NotReceived, RestrictedField] public bool IsOffer { get; set; }
		public string OrderNo { get; set; }
		public string DocumentNo { get; set; }
		public Guid? ContactId { get; set; }
		[NotReceived, ExplicitExpand] public CompanyRest Company { get; set; }
		public Guid? ContactAddressId { get; set; }
		[NotReceived, ExplicitExpand] public AddressRest ContactAddress { get; set; }
		public Guid? DeliveryAddressId { get; set; }
		[NotReceived, ExplicitExpand] public AddressRest DeliveryAddress { get; set; }
		public Guid? BillingAddressId { get; set; }
		[NotReceived, ExplicitExpand] public AddressRest BillingAddres { get; set; }
		public DateTime OrderDate { get; set; }
		public DateTime? DeliveryDate { get; set; }
		public DateTime? ExportDate { get; set; }
		public bool SendConfirmation { get; set; }
		public bool ConfirmationSent { get; set; }
		public string StatusKey { get; set; }
		public string ResponsibleUser { get; set; }
		[NotReceived, ExplicitExpand] public UserRest ResponsibleUserUser { get; set; }
		public string Representative { get; set; }
		public decimal Price { get; set; }
		[RestrictedField, NotReceived]
		public decimal CalculatedPrice { get; set; }
		[RestrictedField, NotReceived]
		public decimal? CalculatedPriceWithDiscount { get; set; }
		public string CurrencyKey { get; set; }
		public decimal Discount { get; set; }
		[RestrictedField, NotReceived]
		public decimal? RealizedDiscount { get; set; }
		public DiscountType DiscountType { get; set; }
		public string PublicDescription { get; set; }
		public string PrivateDescription { get; set; }
		public string CustomerOrderNumber { get; set; }
		public string Comission { get; set; }
		public bool IsExported { get; set; }
		public bool ReadyForExport { get; set; }
		[NotReceived, RestrictedField] public string OrderType { get; set; }
		public string Signature { get; set; }
		public virtual DateTime? SignatureDate { get; set; }
		public virtual string SignatureName { get; set; }
		public virtual bool SignPrivacyPolicyAccepted { get; set; }
		public Guid? ContactPersonId { get; set; }
		[NotReceived, ExplicitExpand] public PersonRest Person { get; set; }
		public string CustomFax { get; set; }
		public string CustomEmail { get; set; }
		public string CommunicationType { get; set; }
		public string OrderCategoryKey { get; set; }
		public string OrderEntryType { get; set; }
		public Visibility Visibility { get; set; }
		[RestrictedField] public Guid[] VisibleToUsergroupIds { get; set; }
		[RestrictedField] public string[] VisibleToUserIds { get; set; }

	}
}
