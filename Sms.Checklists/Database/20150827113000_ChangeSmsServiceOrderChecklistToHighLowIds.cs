namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150827113000)]
	public class ChangeSmsServiceOrderChecklistToHighLowIds : Migration
	{
		private const int Low = 32;

		public override void Up()
		{
			Database.ExecuteNonQuery("DECLARE @TableName SYSNAME = 'SMS.ServiceOrderChecklist' " +
			                         "DECLARE @PrimaryKeyName sysname = ( " +
			                         "select name " +
			                         "from sys.key_constraints " +
			                         "where type = 'PK' and parent_object_id = object_id(@TableName)) " +
			                         "EXECUTE ('alter table ' + @TableName + ' drop constraint ' + @PrimaryKeyName)");

			var hasDynamicFormReferenceKeyChangedToGuid = (int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'CRM' AND TABLE_NAME = 'DynamicFormReference' AND COLUMN_NAME = 'ReferenceKey' and DATA_TYPE = 'uniqueidentifier'") == 1;
			var columnType = hasDynamicFormReferenceKeyChangedToGuid ? "uniqueidentifier" : "BIGINT";
			Database.ExecuteNonQuery(string.Format("ALTER TABLE [SMS].[ServiceOrderChecklist] ALTER COLUMN DynamicFormReferenceKey {0} NOT NULL", columnType));
			Database.ExecuteNonQuery("ALTER TABLE [SMS].[ServiceOrderChecklist] ADD CONSTRAINT [PK_ServiceOrderChecklist] PRIMARY KEY ([DynamicFormReferenceKey])");
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM sys.foreign_keys WHERE name = 'FK_ServiceOrderChecklist_DynamicFormReference'") == 0)
			{
				Database.AddForeignKey("FK_ServiceOrderChecklist_DynamicFormReference", "[SMS].[ServiceOrderChecklist]", "DynamicFormReferenceKey", "[CRM].[DynamicFormReference]", "DynamicFormReferenceId");
			}
		}
	}
}