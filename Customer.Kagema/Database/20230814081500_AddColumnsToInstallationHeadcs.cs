namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20230814080400)]
	public class AddColumnsToSmsInstallation : Migration
	{
		public override void Up()
		{
			Database.RemoveColumnIfExisting("SMS.ServiceOrderHead", "ShipToCode");
			Database.AddColumnIfNotExisting("SMS.InstallationHead", new Column("ShipToCode", DbType.String, 10, ColumnProperty.Null));
		}
	}
}
