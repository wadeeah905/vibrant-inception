namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	using Sms.Checklists.Model;

	[Migration(20200102131500)]
	public class AddEntityTypeServiceCaseChecklist : Migration
	{
		public override void Up()
		{
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<ServiceCaseChecklist>("CRM", "DynamicFormReference");
		}
	}
}