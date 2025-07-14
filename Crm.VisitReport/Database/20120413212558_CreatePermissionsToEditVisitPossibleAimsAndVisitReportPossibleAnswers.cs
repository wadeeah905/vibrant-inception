namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120413212558)]
	public class CreatePermissionsToEditVisitPossibleAimsAndVisitReportPossibleAnswers : Migration
	{
		public override void Up()
		{
			StringBuilder sb = new StringBuilder();

			sb.AppendLine("INSERT INTO CRM.Permission (Name, PluginName)");
			sb.AppendLine("VALUES");
			sb.AppendLine("('EditVisitPossibleAims', 'Crm.VisitReport'),");
			sb.AppendLine("('EditVisitReportPossibleAnswers', 'Crm.VisitReport')");

			Database.ExecuteNonQuery(sb.ToString());
		}

		public override void Down()
		{
		}
	}
}
