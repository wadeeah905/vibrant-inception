namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20230327130200)]

	public class AddColumnsIPosNoToSmsServiceOrderMaterial : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.ServiceOrderMaterial", new Column("iPosNo", DbType.Int32, ColumnProperty.Null));
		}
	}
}
