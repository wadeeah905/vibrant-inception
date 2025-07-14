namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170524134800)]
	public class DropVisitReportKey : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'FK_Visit_VisitReport')
			BEGIN
				ALTER TABLE [CRM].[Visit] DROP CONSTRAINT [FK_Visit_VisitReport]
			END");
			Database.RemoveColumnIfExisting("CRM.Visit", "VisitReportKey");
		}
	}
}