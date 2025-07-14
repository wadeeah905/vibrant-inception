namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20241121080000)]
	public class AddDisplayDescriptionToServiceOrderMatrerials : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.ServiceOrderMaterial", new Column("DisplayDescription", DbType.String, 150, ColumnProperty.Null));
		}
	}
}
