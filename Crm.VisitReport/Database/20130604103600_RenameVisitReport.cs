namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130604103600)]
	public class RenameVisitReport : Migration
	{
		public override void Up()
		{
			if (Database.TableExists("[CRM].[VisitReport]"))
			{
				Database.ExecuteNonQuery("sp_rename '[CRM].[VisitReport]', 'OLD_VisitReport'");

				var sb = new StringBuilder();

				sb.AppendLine("ALTER TABLE [CRM].[OLD_VisitReport]");
				sb.AppendLine("DROP CONSTRAINT PK_VisitReport");

				Database.ExecuteNonQuery(sb.ToString());
			}
		}
		public override void Down()
		{
		}
	}
}