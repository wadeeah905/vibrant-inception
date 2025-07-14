namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240112115000)]
	public class AddColumnSendToCustomerToCrmDocumentAttributes: Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.DocumentAttributes", new Column("SendToCustomer", DbType.Boolean, ColumnProperty.Null, true));
		}
	}
}
