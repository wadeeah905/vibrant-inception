namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120424172535)]
	public class InitVisitFrequencyColumnsInCrmContact : Migration
	{
		public override void Up()
		{
      StringBuilder sb = new StringBuilder();
      sb.AppendLine("UPDATE Crm.Contact");
      sb.AppendLine("SET CompanyVisitFrequencyValue = 0");
			sb.AppendLine("WHERE ContactType = 'Company' AND CompanyVisitFrequencyValue IS NULL");
			Database.ExecuteNonQuery(sb.ToString());

      sb.Clear();
			sb.AppendLine("UPDATE Crm.Contact");
      sb.AppendLine("SET CompanyVisitFrequencyTimeUnitKey = (SELECT TOP(1) Value FROM LU.TimeUnit)");
      sb.AppendLine("WHERE ContactType = 'Company' AND CompanyVisitFrequencyTimeUnitKey IS NULL");
			Database.ExecuteNonQuery(sb.ToString());
		}
		public override void Down()
		{
			
		}
	}
}
