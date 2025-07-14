namespace Sms.Checklists.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20190924160700)]
	public class AddTableSmsServiceCaseChecklist : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[SMS].[ServiceCaseChecklist]"))
			{
				Database.AddTable(
					"SMS.ServiceCaseChecklist",
					new Column("DynamicFormReferenceKey", DbType.Guid, ColumnProperty.PrimaryKey),
					new Column("IsCompletionChecklist", DbType.Boolean, ColumnProperty.NotNull, false),
					new Column("IsCreationChecklist", DbType.Boolean, ColumnProperty.NotNull, false)
				);
				Database.AddForeignKey("FK_ServiceCaseChecklist_DynamicFormReference", "SMS.ServiceCaseChecklist", "DynamicFormReferenceKey", "CRM.DynamicFormReference", "DynamicFormReferenceId");
			}
		}
	}
}