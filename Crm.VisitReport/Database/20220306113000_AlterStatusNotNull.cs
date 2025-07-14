namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20220306113000)]
	public class AlterStatusNotNull : Migration
	{
		public override void Up()
		{
			string sql = "ALTER TABLE [CRM].[Visit] ALTER COLUMN [Status] nvarchar(50) NOT NULL";
			Database.ExecuteNonQuery(sql);
		}
	}
}
