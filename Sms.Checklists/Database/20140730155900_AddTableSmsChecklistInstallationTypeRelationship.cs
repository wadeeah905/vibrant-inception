namespace Sms.Checklists.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140730155900)]
	public class AddTableSmsChecklistInstallationTypeRelationship : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[SMS].[ChecklistInstallationTypeRelationship]"))
			{
				var dynamicFormIdIsGuid = (int)Database.ExecuteScalar(@"SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='DynamicForm' AND COLUMN_NAME='DynamicFormId' AND DATA_TYPE = 'uniqueidentifier'") == 1;
				Database.AddTable("[SMS].[ChecklistInstallationTypeRelationship]",
					new Column("ChecklistInstallationTypeRelationshipId", DbType.Int32, ColumnProperty.PrimaryKeyWithIdentity),
					new Column("DynamicFormKey", dynamicFormIdIsGuid ? DbType.Guid : DbType.Int32, ColumnProperty.NotNull),
					new Column("ServiceOrderTypeKey", DbType.String, 50, ColumnProperty.NotNull),
					new Column("InstallationTypeKey", DbType.String, 50, ColumnProperty.NotNull),
					new Column("RequiredForServiceOrderCompletion", DbType.Boolean, ColumnProperty.NotNull, false),
					new Column("SendToCustomer", DbType.Boolean, ColumnProperty.NotNull, false),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull),
					new Column("CreateUser", DbType.String, 50, ColumnProperty.NotNull),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull),
					new Column("ModifyUser", DbType.String, 50, ColumnProperty.NotNull),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true),
					new Column("TenantKey", DbType.Int32, ColumnProperty.Null));
			}
		}
		public override void Down()
		{
		}
	}
}
