namespace Sms.Checklists.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20140730122100)]
	public class AddRequiredForServiceOrderCompletionToSmsServiceOrderChecklist : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.ServiceOrderChecklist", new Column("RequiredForServiceOrderCompletion", DbType.Boolean, ColumnProperty.NotNull, false));
		}
		public override void Down()
		{
			
		}
	}
}
