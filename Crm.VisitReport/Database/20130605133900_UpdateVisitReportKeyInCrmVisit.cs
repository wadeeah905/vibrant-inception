namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130605133900)]
	public class UpdateVisitReportKeyInCrmVisit : Migration
	{
		public override void Up()
		{
			var contactDataType = (string)Database.ExecuteScalar("SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Contact' AND COLUMN_NAME = 'ContactId'");
			Database.ExecuteNonQuery("EXEC sp_rename '[CRM].[Visit].[VisitReportKey]', 'VisitReportKeyOld', 'COLUMN'");
			Database.ExecuteNonQuery($"ALTER TABLE [CRM].[Visit] ADD [VisitReportKey] {contactDataType} NULL");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[Visit] ALTER COLUMN [VisitReportKeyOld] int NULL");

			var sb = new StringBuilder();

			sb.AppendLine("UPDATE v");
			sb.AppendLine("SET v.VisitReportKey = c.ContactId");
			sb.AppendLine("FROM [CRM].[Visit] v");
			sb.AppendLine("JOIN [CRM].[Contact] c");
			sb.AppendLine("ON c.[OldVisitReportId] = v.[VisitReportKeyOld]");
			sb.AppendLine("WHERE c.[ContactType] = 'VisitReport'");

			Database.ExecuteNonQuery(sb.ToString());
		}
		public override void Down()
		{
		}
	}
}