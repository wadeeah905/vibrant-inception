namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Article.Rest.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(Service.Model.ReplenishmentOrderItem))]
	public class ReplenishmentOrderItemRest : RestEntityWithExtensionValues
	{
		public Guid? ArticleId { get; set; }
		public string MaterialNo { get; set; }
		public string Description { get; set; }
		public decimal Quantity { get; set; }
		public string QuantityUnitKey { get; set; }
		public string Remark { get; set; }
		public Guid ReplenishmentOrderId { get; set; }
		[ExplicitExpand, NotReceived] public ArticleRest Article { get; set; }
		[ExplicitExpand, NotReceived] public ReplenishmentOrderRest ReplenishmentOrder { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderMaterialRest[] ServiceOrderMaterials { get; set; }
	}
}
