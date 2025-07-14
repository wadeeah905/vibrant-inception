namespace Sms.Checklists.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140709165400)]
	public class AddTableSmsServiceOrderChecklist : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[SMS].[ServiceOrderChecklist]"))
			{
				var hasDynamicFormReferenceKeyChangedToGuid = (int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'CRM' AND TABLE_NAME = 'DynamicFormReference' AND COLUMN_NAME = 'ReferenceKey' and DATA_TYPE = 'uniqueidentifier'") == 1;
				Database.AddTable("SMS.ServiceOrderChecklist",
					new Column("DynamicFormReferenceKey", hasDynamicFormReferenceKeyChangedToGuid ? DbType.Guid : DbType.Int32, ColumnProperty.PrimaryKey),
					new Column("ServiceOrderTimeKey", DbType.Guid, ColumnProperty.Null)
					);
			}
		}
		public override void Down()
		{
			
		}
	}
}
