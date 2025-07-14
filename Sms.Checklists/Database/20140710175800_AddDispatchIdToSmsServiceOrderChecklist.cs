namespace Sms.Checklists.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20140710175800)]
	public class AddDispatchIdToSmsServiceOrderChecklist : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.ServiceOrderChecklist", new Column("DispatchId", DbType.Int64, ColumnProperty.Null));
		}
		public override void Down()
		{
			
		}
	}
}
