namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20220831150400)]
	public class AddColumnsToSmsServiceOrderHead : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.ServiceOrderHead", new Column("SalespersonName", DbType.String, 256, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("SMS.ServiceOrderHead", new Column("ShipToCode", DbType.String, 10, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("SMS.ServiceOrderHead", new Column("LMStatus", DbType.Int16, ColumnProperty.Null));
		}
	}
}
