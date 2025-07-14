namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20220922102500)]
	public class AddExportNewServiceOrderToServiceOrderHead : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.ServiceOrderHead", new Column("ExportNewServiceOrder", DbType.Boolean, false));
		}
	}
}