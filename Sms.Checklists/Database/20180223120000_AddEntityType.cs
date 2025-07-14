namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	using Sms.Checklists.Model;

	[Migration(20180223120000)]
	public class AddEntityType : Migration
	{
		public override void Up()
		{
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<ChecklistInstallationTypeRelationship>("SMS", "ChecklistInstallationTypeRelationship");
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<ServiceOrderChecklist>("CRM", "DynamicFormReference");
		}
	}
}