namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20190726112200)]
	public class AddVisitsToMigratedVisitReports : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(
		@"DECLARE @migrationNr nvarchar(24) = 'Migration_20190726112200';
				INSERT INTO [CRM].[Contact]
					([ParentKey]
					,[ContactType]
					,[Name]
					,[ResponsibleUser]
					,[IsActive]
					,[CreateDate]
					,[ModifyDate]
					,[CreateUser]
					,[ModifyUser]
					,[Visibility]
					,[IsExported]
					,[OldVisitReportId])
				SELECT
					vrc.[ParentKey]
					,'Visit'
					,vrc.[Name]
					,vrdfr.[ResponsibleUser]
					,1
					,dfr.[CreateDate]
					,GETUTCDATE()
					,dfr.[CreateUser]
					,@migrationNr
					,vrc.[Visibility]
					,vrc.[IsExported]
					,vrc.[ContactIdOld]
				FROM [CRM].[DynamicFormReference] dfr 
				JOIN [CRM].[VisitReportDynamicFormReference] vrdfr ON dfr.[DynamicFormReferenceId] = vrdfr.[DynamicFormReferenceKey]
				JOIN [CRM].[Contact] vrc ON dfr.[LegacyId] = vrc.[ContactId]

				ALTER TABLE [CRM].[Visit] ALTER COLUMN AddressKeyOld int NULL;

				INSERT INTO [CRM].[Visit]
					([AddressKey]
					,[PlannedDate]
					,[ContactKey]
					,[VisitReportKeyOld])
				SELECT
					pca.[AddressId]
					,vc.[CreateDate]
					,vc.[ContactId]
					,vc.[OldVisitReportId]
				FROM 
				[CRM].[Contact] vc
				JOIN [CRM].[Address] pca ON vc.[ParentKey] = pca.[CompanyKey] AND pca.[IsCompanyStandardAddress] = 1
				WHERE vc.[ModifyUser] = @migrationNr


				UPDATE vrdfr
				SET [VisitId] = v.ContactKey
				FROM [CRM].[Visit] v 
				JOIN [CRM].[Contact] vrc ON v.[VisitReportKeyOld] = vrc.[ContactIdOld]
				JOIN [CRM].[DynamicFormReference] dfr ON dfr.[LegacyId] = vrc.[ContactId]
				JOIN [CRM].[VisitReportDynamicFormReference] vrdfr ON dfr.[DynamicFormReferenceId] = vrdfr.[DynamicFormReferenceKey]


				UPDATE [CRM].[Note]
				SET [ElementKey] = vc.[ContactId], [ModifyUser] = @migrationNr, [ModifyDate] = GETUTCDATE()
				FROM
				[CRM].[Note] n
				JOIN [CRM].[Contact] vc on n.[ElementKeyOld] = vc.[OldVisitReportId]
				AND vc.[ModifyUser] = @migrationNr


				UPDATE [CRM].[BusinessRelationship]
				SET [ParentCompanyKey] = vrdfr.[VisitId], [ModifyUser] = @migrationNr, [ModifyDate] = GETUTCDATE()
				FROM
				[CRM].[BusinessRelationship] r
				JOIN [CRM].[Contact] vrc on vrc.[ContactIdOld] = r.[ParentCompanyKeyOld]
				JOIN [CRM].[DynamicFormReference] dfr ON dfr.[LegacyId] = vrc.[ContactId]
				JOIN [CRM].[VisitReportDynamicFormReference] vrdfr ON dfr.[DynamicFormReferenceId] = vrdfr.[DynamicFormReferenceKey]
				JOIN [CRM].[Contact] vc on vc.[ContactId] = vrdfr.[VisitId]
				AND vc.[ModifyUser] = @migrationNr"
			);
		}
	}
}