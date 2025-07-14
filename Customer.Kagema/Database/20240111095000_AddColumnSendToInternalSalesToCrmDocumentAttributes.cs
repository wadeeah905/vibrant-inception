namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240111095000)]
	public class AddColumnSendToInternalSalesToCrmDocumentAttributes : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.DocumentAttributes", new Column("SendToInternalSales", DbType.Boolean, ColumnProperty.Null, true));
		}
	}
}
