namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170526123000)]
	public class RemoveVisitFrequencyValuePerYearFromCrmCompany : Migration
	{
		public override void Up()
		{
			Database.RemoveColumnIfExisting("CRM.Company", "VisitFrequencyValuePerYear");
		}
	}
}