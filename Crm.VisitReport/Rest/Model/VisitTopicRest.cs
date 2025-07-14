namespace Crm.VisitReport.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;
	using Crm.VisitReport.Model;

	[RestTypeFor(DomainType = typeof(VisitTopic))]
	public class VisitTopicRest : RestEntityWithExtensionValues
	{
		public string Description { get; set; }
		public int Position { get; set; }
		public string Topic { get; set; }
		public Guid VisitKey { get; set; }
		[NotReceived, ExplicitExpand] public VisitRest Visit { get; set; }
		[NotReceived, ExplicitExpand] public UserRest CreateUserUser { get; set; }
	}

}
