namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170524134600)]
	public class DropUnusedAddressPropertiesFromCrmVisit : Migration
	{
		public override void Up()
		{
			Database.RemoveColumnIfExisting("CRM.Visit", "City");
			Database.RemoveColumnIfExisting("CRM.Visit", "CountryKey");
			Database.RemoveColumnIfExisting("CRM.Visit", "Street");
			Database.RemoveColumnIfExisting("CRM.Visit", "ZipCode");
		}
	}
}