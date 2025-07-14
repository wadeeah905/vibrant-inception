namespace Crm.Order.Rest.Model
{
	using System;

	using Crm.Article.Model.Enums;
	using Crm.Article.Rest.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Order.Model;

	[RestTypeFor(DomainType = typeof(OrderItem))]
	public class OrderItemRest : RestEntityWithExtensionValues
	{
		public Guid OrderId { get; set; }
		public string Position { get; set; }
		public Guid ArticleId { get; set; }
		[NotReceived, ExplicitExpand] public ArticleRest Article { get; set; }
		public string ArticleNo { get; set; }
		public string ArticleDescription { get; set; }
		[NotReceived] public string ArticleTypeKey { get; set; }
		public string CustomDescription { get; set; }
		public string CustomArticleNo { get; set; }
		public string AdditionalInformation { get; set; }
		public decimal QuantityValue { get; set; }
		public string QuantityUnitKey { get; set; }
		[NotReceived, RestrictedField] public decimal QuantityStep { get; set; }
		public bool IsAccessory { get; set; }
		public bool IsAlternative { get; set; }
		public bool IsCarDump { get; set; }
		public bool IsOption { get; set; }
		public bool IsSample { get; set; }
		public bool IsRemoval { get; set; }
		public bool IsSerial { get; set; }
		public decimal Price { get; set; }
		public decimal? PurchasePrice { get; set; }
		public DateTime? DeliveryDate { get; set; }
		public decimal Discount { get; set; }
		public DiscountType DiscountType { get; set; }
		[NotReceived] public string VATLevelKey { get; set; }
		public Guid? ParentOrderItemId { get; set; }
		[NotReceived, RestrictedField] public bool ArticleHasAccessory { get; set; }

	}
}
