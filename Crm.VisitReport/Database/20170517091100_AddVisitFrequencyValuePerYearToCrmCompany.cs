namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170517091100)]
	public class AddVisitFrequencyValuePerYearToCrmCompany : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("CRM.Company", "VisitFrequencyValuePerYear"))
			{
				Database.ExecuteNonQuery(@"ALTER TABLE CRM.Company ADD VisitFrequencyValuePerYear AS dbo.GetVisitFrequencyValuePerYear(VisitFrequencyTimeUnitKey, VisitFrequencyValue)");
			}
		}
	}
}