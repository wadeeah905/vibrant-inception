namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20190927104400)]
	public class AddVisitTopicsToMigratedVisitReports : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(
				@"DECLARE @migrationNr nvarchar(24) = 'Migration_20190726112200';
				UPDATE [CRM].[VisitTopic]
				SET [VisitKey] = vrdfr.[VisitId], [ModifyUser] = @migrationNr, [ModifyDate] = GETUTCDATE()
				FROM
				[CRM].[VisitTopic] vt
				JOIN [CRM].[Contact] vrc on vrc.[ContactIdOld] = vt.[VisitKeyOld]
				JOIN [CRM].[DynamicFormReference] dfr ON dfr.[LegacyId] = vrc.[ContactId]
				JOIN [CRM].[VisitReportDynamicFormReference] vrdfr ON dfr.[DynamicFormReferenceId] = vrdfr.[DynamicFormReferenceKey]
				JOIN [CRM].[Contact] vc on vc.[ContactId] = vrdfr.[VisitId]
				AND vc.[ModifyUser] = @migrationNr"
			);
		}
	}
}