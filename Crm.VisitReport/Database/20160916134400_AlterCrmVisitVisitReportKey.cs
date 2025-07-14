namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160916134400)]
	public class AlterCrmVisitVisitReportKey : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(
				@"
				IF EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Visit' AND COLUMN_NAME='VisitReportKey' AND DATA_TYPE = 'int')
				BEGIN
					EXEC sp_rename '[CRM].[Visit].[VisitReportKey]', 'VisitReportKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[Visit] ADD [VisitReportKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[VisitReportKey] = b.[ContactId] FROM [Crm].[Visit] a LEFT OUTER JOIN [CRM].[Contact] b ON a.[VisitReportKeyOld] = b.[ContactIdOld]')
					ALTER TABLE [CRM].[Visit] ADD CONSTRAINT [FK_Visit_VisitReport] FOREIGN KEY([VisitReportKey]) REFERENCES [CRM].[Contact] ([ContactId])
				END");
		}
	}
}