namespace Sms.Checklists.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20190919163000)]
	public class AddServiceCaseTemplateExtensions : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("SMS.ServiceCaseTemplate", "CompletionDynamicFormId"))
			{
				Database.AddColumnIfNotExisting("SMS.ServiceCaseTemplate", new Column("CompletionDynamicFormId", DbType.Guid, ColumnProperty.Null));
				Database.AddForeignKey("FK_ServiceCaseTemplate_CompletionDynamicForm", "SMS.ServiceCaseTemplate", "CompletionDynamicFormId", "CRM.DynamicForm", "DynamicFormId");
			}

			if (!Database.ColumnExists("SMS.ServiceCaseTemplate", "CreationDynamicFormId"))
			{
				Database.AddColumnIfNotExisting("SMS.ServiceCaseTemplate", new Column("CreationDynamicFormId", DbType.Guid, ColumnProperty.Null));
				Database.AddForeignKey("FK_ServiceCaseTemplate_CreationDynamicForm", "SMS.ServiceCaseTemplate", "CompletionDynamicFormId", "CRM.DynamicForm", "DynamicFormId");
			}
		}
	}
}