namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140715133300)]
	public class MigrateOldServiceOrderChecklists : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("INSERT INTO [SMS].[ServiceOrderChecklist] ([DynamicFormReferenceKey]) SELECT [DynamicFormReferenceId] FROM [CRM].[DynamicFormReference] dfr WHERE dfr.[DynamicFormReferenceType] = 'ServiceOrderChecklist' AND NOT EXISTS (SELECT TOP 1 NULL FROM [SMS].[ServiceOrderChecklist] soc WHERE soc.[DynamicFormReferenceKey] = dfr.[DynamicFormReferenceId])");
		}
		public override void Down()
		{
		}
	}
}