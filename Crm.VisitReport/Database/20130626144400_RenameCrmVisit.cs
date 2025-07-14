namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130626144400)]
	public class RenameCrmVisit : Migration
	{
		public override void Up()
		{
			if (Database.TableExists("[CRM].[Visit]") && !Database.TableExists("[CRM].[OLD_Visit]"))
			{
				Database.ExecuteNonQuery("sp_rename '[CRM].[Visit]', 'OLD_Visit'");

				var sb = new StringBuilder();

				sb.AppendLine("ALTER TABLE [CRM].[OLD_Visit]");
				sb.AppendLine("DROP CONSTRAINT PK_Visit");

				Database.ExecuteNonQuery(sb.ToString());
			}
		}
		public override void Down()
		{
		}
	}
}