namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160623145300)]
	public class ChangeSmsChecklistDispatchIdToGuid : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='SMS' AND TABLE_NAME='ServiceOrderChecklist' AND COLUMN_NAME='DispatchId' AND DATA_TYPE like '%int')
				BEGIN
					EXEC sp_rename '[SMS].[ServiceOrderChecklist].[DispatchId]', 'DispatchIdOld', 'COLUMN'
					ALTER TABLE [SMS].[ServiceOrderChecklist] ADD [DispatchId] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[DispatchId] = b.[DispatchId] FROM [SMS].[ServiceOrderChecklist] a LEFT OUTER JOIN [SMS].[ServiceOrderDispatch] b ON a.[DispatchIdOld] = b.[DispatchIdOld]')
					ALTER TABLE [SMS].[ServiceOrderChecklist] ALTER COLUMN [DispatchIdOld] bigint NULL
				END");
		}
	}
}