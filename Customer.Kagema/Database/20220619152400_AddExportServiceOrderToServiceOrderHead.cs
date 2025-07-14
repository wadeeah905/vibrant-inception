namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20220619152400)]
	public class AddExportServiceOrderToServiceOrderHead : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.ServiceOrderHead", new Column("ExportServiceOrder", DbType.Boolean, false));
		}
	}
}