namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170313123200)]
	public class FillVisitIdOfVisitReport : Migration
	{
		public override void Up()
		{
			var stringBuilder = new StringBuilder();

			stringBuilder.AppendLine("UPDATE visitReport");
			stringBuilder.AppendLine("SET visitReport.VisitId = visit.ContactKey");
			stringBuilder.AppendLine("FROM CRM.VisitReport visitReport");
			stringBuilder.AppendLine("JOIN CRM.Visit visit");
			stringBuilder.AppendLine("ON visit.VisitReportKey = visitReport.ContactKey");
			stringBuilder.AppendLine("WHERE visitReport.VisitId IS NULL");

			Database.ExecuteNonQuery(stringBuilder.ToString());
		}

		public override void Down()
		{
		}
	}
}