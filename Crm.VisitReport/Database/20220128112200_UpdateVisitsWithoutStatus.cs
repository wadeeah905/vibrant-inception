namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20220128112200)]
	public class UpdateVisitsWithoutStatus : Migration
	{
		public override void Up()
		{
			string sql = @"
UPDATE [CRM].[Visit] SET [Status] = 'Completed' WHERE ContactKey 
NOT IN (SELECT visit.ContactKey FROM [CRM].[Visit] visit
INNER JOIN [CRM].[VisitReportDynamicFormReference] visitReport ON visit.ContactKey = visitReport.VisitId 
INNER JOIN [CRM].[DynamicFormReference] dynamicForm ON visitReport.DynamicFormReferenceKey = dynamicForm.DynamicFormReferenceId AND dynamicForm.Completed = 1)
AND PlannedDate < GETDATE();

UPDATE [CRM].[Visit] SET [Status] = 'InProgress' FROM [CRM].[Visit] visit
INNER JOIN [CRM].[VisitReportDynamicFormReference] visitReport on visit.ContactKey = visitReport.VisitId 
INNER JOIN [CRM].[DynamicFormReference] dynamicForm ON visitReport.DynamicFormReferenceKey = dynamicForm.DynamicFormReferenceId AND dynamicForm.Completed = 0;

UPDATE [CRM].[Visit] SET [Status] = 'Scheduled' FROM [CRM].[Visit] visit
LEFT JOIN [CRM].[VisitReportDynamicFormReference] visitReport ON visit.ContactKey = visitReport.VisitId 
WHERE visitReport.VisitId IS NULL AND visit.PlannedDate IS NOT NULL;

UPDATE [CRM].[Visit] SET [Status] = 'Created' WHERE [Status] IS NULL
";
			Database.ExecuteNonQuery(sql);
		}
	}
}
