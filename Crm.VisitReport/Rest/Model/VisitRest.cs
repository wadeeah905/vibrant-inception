namespace Crm.VisitReport.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;
	using Crm.VisitReport.Model;

	using AddressRest = Crm.Rest.Model.AddressRest;
	using UserRest = Crm.Rest.Model.UserRest;

	[RestTypeFor(DomainType = typeof(Visit))]
	public class VisitRest : ContactRest
	{
		public Guid AddressId { get; set; }
		public string ContactPerson { get; set; }
		public string CustomAim { get; set; }
		public DateTime? PlannedDate { get; set; }
		public TimeSpan? PlannedDuration { get; set; }
		public DateTime? PlannedEndDate { get; set; }
		public DateTime? PlannedTime { get; set; }
		public string VisitAimKey { get; set; }
		public string StatusKey { get; set; }
		[NotReceived, ExplicitExpand] public UserRest ResponsibleUserUser { get; set; }
		[NotReceived, ExplicitExpand] public AddressRest Address { get; set; }
		[NotReceived, ExplicitExpand] public CompanyRest Parent { get; set; }
	}
}
