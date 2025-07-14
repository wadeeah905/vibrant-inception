namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Article.Rest.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.PerDiem.Rest.Model;
	using Crm.Rest.Model;
	using Crm.Service.Model;

	[RestTypeFor(DomainType = typeof(ServiceOrderTimePosting))]
	public class ServiceOrderTimePostingRest : TimeEntryRest
	{
		public Guid? ServiceOrderTimeId { get; set; }
		public Guid? ArticleId { get; set; }
		public Guid? DispatchId { get; set; }
		public Guid OrderId { get; set; }
		public string ItemNo { get; set; }
		public string InternalRemark { get; set; }
		public string Username { get; set; }
		[RestrictedField] public TimeSpan? Break { get; set; }
		public int? Kilometers { get; set; }
		[RestrictedField] public virtual TimeSpan? PlannedDuration { get; set; }
		[ExplicitExpand, NotReceived] public ArticleRest Article { get; set; }
		[ExplicitExpand, NotReceived] public UserRest User { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderDispatchRest ServiceOrderDispatch { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderTimeRest ServiceOrderTime { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderHeadRest ServiceOrder { get; set; }
	}
}
