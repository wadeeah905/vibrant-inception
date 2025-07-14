namespace Crm.VisitReport.Model.Notes
{
	using Crm.Library.Globalization.Extensions;
	using Crm.Model.Notes;

	public class VisitReportClosedNote : Note
	{
		public override string DisplayText
		{
			get { return ResourceManager.Instance.GetTranslation("VisitReportClosed", searchStrategy: Search.OnlyPlugin); }
		}
		public override string ImageVirtualUrl
		{
			get { return "~/Content/img/Company.gif"; }
		}
		public override string PermamentLinkVirtualUrl
		{
			get { return "~/Crm.VisitReport/VisitReport/Details/" + Text; }
		}
		public override string PermanentLabelResourceKey
		{
			get { return "VisitReportClosedBy"; }
		}

		public VisitReportClosedNote()
		{
			Plugin = "Crm.VisitReport";
		}
	}
}