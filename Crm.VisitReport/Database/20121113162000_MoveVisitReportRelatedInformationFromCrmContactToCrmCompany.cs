namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20121113162000)]
	public class MoveVisitReportRelatedInformationFromCrmContactToCrmCompany : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("UPDATE c");
			sb.AppendLine("SET c.VisitFrequencyValue = co.CompanyVisitFrequencyValue");
			sb.AppendLine(", c.VisitFrequencyTimeUnitKey = co.CompanyVisitFrequencyTimeUnitKey");
			sb.AppendLine("FROM [CRM].[Company] c");
			sb.AppendLine("JOIN [CRM].[Contact] co");
			sb.AppendLine("ON co.ContactId = c.ContactKey");
			sb.AppendLine("AND co.ContactType = 'Company'");

			Database.ExecuteNonQuery(sb.ToString());
		}
		public override void Down()
		{
			Database.ExecuteNonQuery("UPDATE [CRM].[Company] SET VisitFrequencyValue = NULL, VisitFrequencyTimeUnitKey = NULL");
		}
	}
}