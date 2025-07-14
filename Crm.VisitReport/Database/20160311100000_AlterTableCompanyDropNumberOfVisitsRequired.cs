namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160311100000)]
	public class AlterTableCompanyDropNumberOfVisitsRequired : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(
				"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'NumberOfVisitsRequired' AND Object_ID = Object_ID(N'[CRM].[Company]')) " +
				"BEGIN ALTER TABLE [CRM].[Company] DROP COLUMN NumberOfVisitsRequired END");
		}
	}
}