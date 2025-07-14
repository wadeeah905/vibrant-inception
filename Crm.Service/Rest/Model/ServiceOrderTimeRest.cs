namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Article.Model.Enums;
	using Crm.Article.Rest.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Service.Model;

	[RestTypeFor(DomainType = typeof(ServiceOrderTime))]
	public class ServiceOrderTimeRest : RestEntityWithExtensionValues
	{
		public Guid? ArticleId { get; set; }
		public DateTime? CompleteDate { get; set; }
		public string CompleteUser { get; set; }
		public Guid OrderId { get; set; }
		public string PosNo { get; set; }
		public string StatusKey { get; set; }
		public string ItemNo { get; set; }
		public string Description { get; set; }
		public string Comment { get; set; }
		public decimal? Price { get; set; }
		public decimal? TotalValue { get; set; }
		public decimal Discount { get; set; }
		public DiscountType DiscountType { get; set; }
		[RestrictedField] public TimeSpan? EstimatedDuration { get; set; }
		[RestrictedField] public TimeSpan? ActualDuration { get; set; }
		[RestrictedField] public TimeSpan? InvoiceDuration { get; set; }
		public string CausingItemNo { get; set; }
		public string CausingItemSerialNo { get; set; }
		public string CausingItemPreviousSerialNo { get; set; }
		public string Diagnosis { get; set; }
		public string NoCausingItemSerialNoReasonKey { get; set; }
		public string NoCausingItemPreviousSerialNoReasonKey { get; set; }
		public Guid? InstallationId { get; set; }
		public bool IsCostLumpSum { get; set; }
		public bool IsMaterialLumpSum { get; set; }
		public bool IsTimeLumpSum { get; set; }
		public string InvoicingTypeKey { get; set; }
		[ExplicitExpand, NotReceived] public InstallationRest Installation { get; set; }
		[ExplicitExpand, NotReceived] public ArticleRest Article { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderTimePostingRest[] Postings { get; set; }
		[ExplicitExpand, NotReceived] public ServiceCaseRest[] ServiceCases { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderMaterialRest[] ServiceOrderMaterials { get; set; }
	}
}
