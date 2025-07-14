namespace Crm.VisitReport.Rest.Model
{
	using System;

	using Crm.DynamicForms.Rest.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;
	using Crm.VisitReport.Model;

	[RestTypeFor(DomainType = typeof(VisitReport))]
	public class VisitReportRest : DynamicFormReferenceRest
	{
		public DateTime Date { get; set; }
		public string ResponsibleUser { get; set; }
		public Guid? VisitId { get; set; }
		[ExplicitExpand, NotReceived] public UserRest ResponsibleUserUser { get; set; }
		[ExplicitExpand, NotReceived] public VisitRest Visit { get; set; }
		[ExplicitExpand, NotReceived] public CompanyRest Company { get; set; }
	}
}
