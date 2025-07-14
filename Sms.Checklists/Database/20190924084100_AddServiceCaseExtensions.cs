namespace Sms.Checklists.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20190924084100)]
	public class AddServiceCaseExtensions : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("SMS.ServiceNotifications", "AffectedDynamicFormElementId"))
			{
				Database.AddColumnIfNotExisting("SMS.ServiceNotifications", new Column("AffectedDynamicFormElementId", DbType.Guid, ColumnProperty.Null));
				Database.AddForeignKey("FK_ServiceNotifications_AffectedDynamicFormElement", "SMS.ServiceNotifications", "AffectedDynamicFormElementId", "CRM.DynamicFormElement", "DynamicFormElementId");
			}
			if (!Database.ColumnExists("SMS.ServiceNotifications", "AffectedDynamicFormReferenceId"))
			{
				if (!Database.PrimaryKeyExists("CRM.DynamicFormReference", "PK_DynamicFormReference"))
				{
					Database.AddPrimaryKey("PK_DynamicFormReference", "CRM.DynamicFormReference", "DynamicFormReferenceId");
				}
				Database.AddColumnIfNotExisting("SMS.ServiceNotifications", new Column("AffectedDynamicFormReferenceId", DbType.Guid, ColumnProperty.Null));
				Database.AddForeignKey("FK_ServiceNotifications_AffectedDynamicFormReference", "SMS.ServiceNotifications", "AffectedDynamicFormReferenceId", "CRM.DynamicFormReference", "DynamicFormReferenceId");
			}
		}
	}
}