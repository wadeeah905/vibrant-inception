namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20220831150100)]
	public class AddColumnsToCrmAddress : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.Address", new Column("ContactName", DbType.String, 256, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("CRM.Address", new Column("ContactTelefon", DbType.String, 10, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("CRM.Address", new Column("ErfStandort", DbType.Int16, ColumnProperty.Null));
		}
	}
}
