namespace Sms.Checklists.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20140730122101)]
	public class AddSendToCustomerToSmsServiceOrderChecklist : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.ServiceOrderChecklist", new Column("SendToCustomer", DbType.Boolean, ColumnProperty.NotNull, false));
		}
		public override void Down()
		{
			
		}
	}
}
