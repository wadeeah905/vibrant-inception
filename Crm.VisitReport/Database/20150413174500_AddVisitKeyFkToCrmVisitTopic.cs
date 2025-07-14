namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150413174500)]
	public class AddVisitKeyFkToCrmVisitTopic : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM sys.foreign_keys WHERE name = 'FK_VisitTopic_Visit'") == 0)
			{
				Database.ExecuteNonQuery("DELETE vt FROM [CRM].[VisitTopic] vt LEFT OUTER JOIN [CRM].[Visit] v ON vt.[VisitKey] = v.[ContactKey] WHERE v.[ContactKey] IS NULL");
				Database.AddForeignKey("FK_VisitTopic_Visit", "[CRM].[VisitTopic]", "VisitKey", "[CRM].[Visit]", "ContactKey", ForeignKeyConstraint.Cascade);
			}
		}
	}
}