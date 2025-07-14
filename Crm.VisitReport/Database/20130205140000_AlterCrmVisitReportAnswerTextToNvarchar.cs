namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130205140000)]
	public class AlterCrmVisitReportPossibleAnswerTextToNvarchar : Migration
	{
		public override void Up()
		{
			var query = new StringBuilder();

			query.AppendLine("ALTER TABLE [CRM].[VisitReportPossibleAnswer]");
			query.AppendLine("ALTER COLUMN [Text] NVARCHAR(MAX) NOT NULL");

			query.AppendLine("ALTER TABLE [CRM].[VisitReportAnswer]");
			query.AppendLine("ALTER COLUMN [Text] NVARCHAR(MAX) NOT NULL");

			Database.ExecuteNonQuery(query.ToString());
		}
		public override void Down()
		{
			var query = new StringBuilder();

			query.AppendLine("ALTER TABLE [CRM].[VisitReportPossibleAnswer]");
			query.AppendLine("ALTER COLUMN [Text] TEXT NOT NULL");

			query.AppendLine("ALTER TABLE [CRM].[VisitReportAnswer]");
			query.AppendLine("ALTER COLUMN [Text] TEXT NOT NULL");

			Database.ExecuteNonQuery(query.ToString());
		}
	}
}