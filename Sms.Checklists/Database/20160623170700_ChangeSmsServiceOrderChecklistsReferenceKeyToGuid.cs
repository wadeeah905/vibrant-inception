namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160623170700)]
	public class ChangeSmsServiceOrderChecklistsReferenceKeyToGuid : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@" IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'PK_ServiceOrderChecklist')
					BEGIN
						ALTER TABLE[SMS].[ServiceOrderChecklist] DROP CONSTRAINT[PK_ServiceOrderChecklist]
					END");

			Database.ExecuteNonQuery(@" IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'FK_ServiceOrderChecklist_DynamicFormReference')
					BEGIN
						ALTER TABLE[SMS].[ServiceOrderChecklist] DROP CONSTRAINT[FK_ServiceOrderChecklist_DynamicFormReference]
					END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='SMS' AND TABLE_NAME='ServiceOrderChecklist' AND COLUMN_NAME='DynamicFormReferenceKey' AND DATA_TYPE like '%int')
				BEGIN
					EXEC sp_rename '[SMS].[ServiceOrderChecklist].[DynamicFormReferenceKey]', 'DynamicFormReferenceKeyOld', 'COLUMN'
					ALTER TABLE [SMS].[ServiceOrderChecklist] ADD [DynamicFormReferenceKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[DynamicFormReferenceKey] = (SELECT TOP 1 b.[DynamicFormReferenceId] FROM [CRM].[DynamicFormReference] b WHERE a.[DynamicFormReferenceKeyOld] = b.[DynamicFormReferenceIdOld]) FROM [SMS].[ServiceOrderChecklist] a')
					ALTER TABLE [SMS].[ServiceOrderChecklist] ALTER COLUMN [DynamicFormReferenceKey] uniqueidentifier NOT NULL
					ALTER TABLE [SMS].[ServiceOrderChecklist] ALTER COLUMN [DynamicFormReferenceKeyOld] bigint NULL
					ALTER TABLE [SMS].[ServiceOrderChecklist] ADD CONSTRAINT [PK_ServiceOrderChecklist] PRIMARY KEY CLUSTERED ([DynamicFormReferenceKey] ASC)
					ALTER TABLE [SMS].[ServiceOrderChecklist] ADD CONSTRAINT [FK_ServiceOrderChecklist_DynamicFormReference] FOREIGN KEY([DynamicFormReferenceKey]) REFERENCES[CRM].[DynamicFormReference]([DynamicFormReferenceId])
				END");
		}
	}
}