namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20220831150200)]
	public class AddColumnsToSmsServiceOrderMaterial : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.ServiceOrderMaterial", new Column("Calculate", DbType.Boolean, ColumnProperty.Null,true));
			Database.AddColumnIfNotExisting("SMS.ServiceOrderMaterial", new Column("OnReport", DbType.Boolean, ColumnProperty.Null, true));
		}
	}
}
