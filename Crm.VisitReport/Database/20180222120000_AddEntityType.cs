namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;
	using Crm.VisitReport.Model;
	using Crm.VisitReport.Model.Notes;
	using Crm.VisitReport.Model.Relationships;

	[Migration(20180222120000)]
	public class AddEntityType : Migration
	{
		public override void Up()
		{
			var helper = new UnicoreMigrationHelper(Database);

			helper.AddEntityTypeAndAuthDataColumnIfNeeded<ContactPersonRelationship>("Crm", "BusinessRelationship");

			helper.AddEntityTypeAndAuthDataColumnIfNeeded<VisitReportClosedNote>("CRM", "Note");
			helper.AddEntityType<VisitReportTopicNote>();

			helper.AddEntityTypeAndAuthDataColumnIfNeeded<Visit>("CRM", "Contact");
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<VisitReport>("CRM", "DynamicFormReference");
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<VisitTopic>("CRM", "VisitTopic");
		}
	}
}