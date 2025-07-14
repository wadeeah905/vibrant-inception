namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Article.Model.Enums;
	using Crm.Article.Rest.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;
	using Crm.Service.Model;

	[RestTypeFor(DomainType = typeof(ServiceOrderMaterial))]
	public class ServiceOrderMaterialRest : RestEntityWithExtensionValues
	{
		public string PosNo { get; set; }
		public string ItemNo { get; set; }
		public string Description { get; set; }
		public string ArticleTypeKey { get; set; }
		public string ExternalRemark { get; set; }
		public string InternalRemark { get; set; }
		public bool IsSerial { get; set; }
		public decimal EstimatedQty { get; set; }
		public decimal ActualQty { get; set; }
		public decimal InvoiceQty { get; set; }
		public string QuantityUnitKey { get; set; }
		public decimal? Price { get; set; }
		public decimal? TotalValue { get; set; }
		public decimal Discount { get; set; }
		public DiscountType DiscountType { get; set; }
		public string CommissioningStatusKey { get; set; }
		public Guid? DispatchId { get; set; }
		public Guid OrderId { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderHeadRest ServiceOrderHead { get; set; }
		public bool SignedByCustomer { get; set; }
		public string FromWarehouse { get; set; }
		public string FromLocation { get; set; }
		public Guid? ArticleId { get; set; }
		public string BatchNo { get; set; }
		public bool IsBatch { get; set; }
		[ExplicitExpand, NotReceived] public ArticleRest Article { get; set; }
		public Guid? ReplenishmentOrderItemId { get; set; }
		[ExplicitExpand, NotReceived] public ReplenishmentOrderItemRest ReplenishmentOrderItem { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderMaterialSerialRest[] ServiceOrderMaterialSerials { get; set; }
		public Guid? ServiceOrderTimeId { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderTimeRest ServiceOrderTime { get; set; }
		[ExplicitExpand, NotReceived] public DocumentAttributeRest[] DocumentAttributes { get; set; }

	}
}
