namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20121113162300)]
	public class DropVisitReportRelatedColumnsFromCrmContact : Migration
	{
		public override void Up()
		{
			if (Database.ColumnExists("[CRM].[Contact]", "CompanyVisitFrequencyValue"))
			{
				Database.RemoveColumn("[CRM].[Contact]", "CompanyVisitFrequencyValue");
			}
			if (Database.ColumnExists("[CRM].[Contact]", "CompanyVisitFrequencyTimeUnitKey"))
			{
				Database.RemoveColumn("[CRM].[Contact]", "CompanyVisitFrequencyTimeUnitKey");
			}
		}
		public override void Down()
		{
			var sb = new StringBuilder();

			sb.AppendLine("ALTER TABLE [CRM].[Contact] ADD");
			sb.AppendLine("[CompanyVisitFrequencyValue] [int] NULL,");
			sb.AppendLine("[CompanyVisitFrequencyTimeUnitKey] [nvarchar](20) NULL");

			Database.ExecuteNonQuery(sb.ToString());
		}
	}
}