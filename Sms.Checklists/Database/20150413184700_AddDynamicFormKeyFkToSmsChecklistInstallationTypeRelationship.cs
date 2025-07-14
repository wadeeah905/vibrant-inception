namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150413184700)]
	public class AddDynamicFormKeyFkToSmsChecklistInstallationTypeRelationship : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM sys.foreign_keys WHERE name = 'FK_ChecklistInstallationTypeRelationship_DynamicForm'") == 0)
			{
				Database.ExecuteNonQuery("DELETE citr FROM [SMS].[ChecklistInstallationTypeRelationship] citr LEFT OUTER JOIN [CRM].[DynamicForm] df ON citr.[DynamicFormKey] = df.[DynamicFormId] WHERE df.[DynamicFormId] IS NULL");
				Database.AddForeignKey("FK_ChecklistInstallationTypeRelationship_DynamicForm", "[SMS].[ChecklistInstallationTypeRelationship]", "DynamicFormKey", "[CRM].[DynamicForm]", "DynamicFormId", ForeignKeyConstraint.NoAction);
			}
		}
	}
}