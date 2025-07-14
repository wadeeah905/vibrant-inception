namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130625085200)]
	public class AlterCrmVisitAllowNullForDate : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("ALTER TABLE [CRM].[Visit] ALTER COLUMN Date date NULL");

			Database.ExecuteNonQuery(sb.ToString());
		}
		public override void Down()
		{
		}
	}
}