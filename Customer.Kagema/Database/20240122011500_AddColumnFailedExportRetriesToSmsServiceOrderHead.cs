namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240122011500)]
	public class AddColumnFailedExportRetriesToSmsServiceOrderHead : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[SMS].[ServiceOrderHead]", new Column("FailedExportRetries", DbType.Int32, ColumnProperty.Null));
		}
	}
}
