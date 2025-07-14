namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170510162000)]
	public class MigrateVisitReportsToDynamicForms : Migration
	{
		public override void Up()
		{
			if (Database.TableExists("[CRM].[VisitReport]"))
			{
				Database.ExecuteNonQuery(@"
INSERT INTO [CRM].[DynamicForm] (
	[Title],
	[Description],
	[CategoryKey],
	[CreateDate],
	[CreateUser],
	[ModifyDate],
	[ModifyUser]
)
SELECT DISTINCT 
	'Besuchsbericht ' + CONVERT(nvarchar, [Version]),
	[Version],
	'VisitReport',
	GETUTCDATE(),
	'Setup',
	GETUTCDATE(),
	'Setup'
FROM [CRM].[VisitReportQuestion]

INSERT INTO [CRM].[DynamicFormElement] (
	[DynamicFormKey],
	[FormElementType],
	[Title],
	[SortOrder],
	[Choices],
	[CreateDate],
	[CreateUser],
	[ModifyDate],
	[ModifyUser],
	[Size],
	[Layout],
	[Rowsize],
	[LegacyId]
)
SELECT 
	df.[DynamicFormId],
	CASE [ControlType] 
		WHEN 'TextBox' THEN 'SingleLineText'
		WHEN 'TextArea' THEN 'MultiLineText'
		WHEN 'CheckBox' THEN 'CheckBoxList'
		WHEN 'DropDown' THEN 'DropDown'
		WHEN 'ListBox' THEN 'CheckBoxList'
	END,
	[Text],
	[Position],
	STUFF((SELECT ',' + CAST(vrpa.[Text] AS NVARCHAR(MAX))     
			FROM [CRM].[VisitReportPossibleAnswer] vrpa WHERE vrq.[Version] = vrpa.[Version] AND vrq.[Position] = vrpa.[PositionQuestion]
			ORDER BY [PositionAnswer]
			FOR XML PATH('')),1,1,''),
	GETUTCDATE(),
	'Setup',
	GETUTCDATE(),
	'Setup',
	1,
	1,
	2,
	vrq.[Position]
FROM [CRM].[VisitReportQuestion] vrq
JOIN [CRM].[DynamicForm] df ON df.[Description] = CONVERT(nvarchar, vrq.[Version]) AND df.[CategoryKey] = 'VisitReport'

INSERT INTO [CRM].[DynamicFormReference] (
	[DynamicFormReferenceType],
	[DynamicFormKey],
	[Completed],
	[CreateDate],
	[CreateUser],
	[ModifyDate],
	[ModifyUser],
	[LegacyId],
	[ReferenceKey],
	[IsActive]
)
SELECT 
	 'VisitReport',
	 df.[DynamicFormId],
	 CASE WHEN vr.[Status] = '2' THEN 1 ELSE 0 END,
	 vrc.[CreateDate],
	 vrc.[CreateUser],
	 vrc.[ModifyDate],
	 vrc.[ModifyUser],
	 vrc.[ContactId],
	 vrc.[ParentKey],
	 vrc.[IsActive]
FROM [CRM].[VisitReport] vr
JOIN [CRM].[Contact] vrc ON vrc.[ContactId] = vr.[ContactKey]
JOIN [CRM].[DynamicForm] df ON df.[Description] = CONVERT(nvarchar, vr.[Version]) AND df.[CategoryKey] = 'VisitReport'

INSERT INTO [CRM].[VisitReportDynamicFormReference] (
	[DynamicFormReferenceKey],
	[Date],
	[ResponsibleUser],
	[VisitId]
)
SELECT
	dfr.[DynamicFormReferenceId],
	vr.[VisitDate],
	vrc.[ResponsibleUser],
	vr.[VisitId]
FROM [CRM].[DynamicFormReference] dfr
JOIN [CRM].[VisitReport] vr ON dfr.[LegacyId] = vr.[ContactKey]
JOIN [CRM].[Contact] vrc ON dfr.[LegacyId] = vrc.[ContactId]
WHERE dfr.[DynamicFormReferenceType] = 'VisitReport'

INSERT INTO [CRM].[DynamicFormResponse] (
	[DynamicFormElementKey],
	[DynamicFormElementType],
	[Value],
	[CreateUser],
	[ModifyUser],
	[CreateDate],
	[ModifyDate],
	[IsActive],
	[DynamicFormReferenceKey]
)
SELECT 
	dfe.[DynamicFormElementId],
	dfe.[FormElementType],
	vra.[Text],
	vrc.[CreateUser],
	vrc.[ModifyUser],
	vrc.[CreateDate],
	vrc.[ModifyDate],
	vrc.[IsActive],
	dfr.[DynamicFormReferenceId]
FROM [CRM].[VisitReportAnswer] vra
JOIN [CRM].[VisitReport] vr ON vr.[ContactKey] = vra.[VisitReportKey]
JOIN [CRM].[Contact] vrc ON vr.[ContactKey] = vrc.[ContactId]
JOIN [CRM].[DynamicFormReference] dfr ON dfr.[LegacyId] = vrc.[ContactId] AND dfr.[DynamicFormReferenceType] = 'VisitReport'
JOIN [CRM].[VisitReportQuestion] vrq ON vrq.[Version] = vr.[Version] AND vrq.[Position] = vra.[PositionQuestion]
JOIN [CRM].[DynamicForm] df ON dfr.[DynamicFormKey] = df.[DynamicFormId]	
JOIN [CRM].[DynamicFormElement] dfe ON dfe.[LegacyId] = vrq.[Position] AND dfe.[DynamicFormKey] = df.[DynamicFormId]
WHERE df.[Description] = CONVERT(nvarchar, vr.[Version])
AND vrq.[ControlType] IN ('TextBox', 'TextArea')
UNION ALL
SELECT 
	[DynamicFormElementId],
	[FormElementType],
	STUFF((SELECT ',' + CAST((vrpa.[PositionAnswer] - 1) AS NVARCHAR(MAX))     
			FROM [CRM].[VisitReportPossibleAnswer] vrpa
			JOIN [CRM].[VisitReportQuestion] vrq ON vrpa.[Version] = vrq.[Version] AND vrpa.[PositionQuestion] = vrq.[Position]
			JOIN [CRM].[VisitReportAnswer] vra ON vra.[Text] = vrpa.[Text] AND vra.[PositionQuestion] = vrq.[Position]
			WHERE vra.[VisitReportKey] = x.[VisitReportKey] AND vrpa.[Version] = x.[Version] AND vrq.[Position] = x.[PositionQuestion]
			ORDER BY [PositionAnswer]
			FOR XML PATH('')),1,1,''),
	[CreateUser],
	[ModifyUser],
	[CreateDate],
	[ModifyDate],
	[IsActive],
	[DynamicFormReferenceId]
FROM (
	SELECT DISTINCT
		dfe.[DynamicFormElementId],
		dfe.[FormElementType],
		vrc.[CreateUser],
		vrc.[ModifyUser],
		vrc.[CreateDate],
		vrc.[ModifyDate],
		vrc.[IsActive],
		dfr.[DynamicFormReferenceId],
		vr.[ContactKey] AS [VisitReportKey],
		vrq.[Position] AS [PositionQuestion],
		vrq.[Version] AS [Version]
	FROM [CRM].[VisitReportAnswer] vra
	JOIN [CRM].[VisitReport] vr ON vr.[ContactKey] = vra.[VisitReportKey]
	JOIN [CRM].[Contact] vrc ON vr.[ContactKey] = vrc.[ContactId]
	JOIN [CRM].[DynamicFormReference] dfr ON dfr.[LegacyId] = vrc.[ContactId] AND dfr.[DynamicFormReferenceType] = 'VisitReport'
	JOIN [CRM].[VisitReportQuestion] vrq ON vrq.[Version] = vr.[Version] AND vrq.[Position] = vra.[PositionQuestion]
	JOIN [CRM].[DynamicForm] df ON dfr.[DynamicFormKey] = df.[DynamicFormId]
	JOIN [CRM].[DynamicFormElement] dfe ON dfe.[LegacyId] = vrq.[Position] AND dfe.[DynamicFormKey] = df.[DynamicFormId]
	WHERE df.[Description] = CONVERT(nvarchar, vr.[Version])
	AND vrq.[ControlType] IN ('CheckBox', 'ListBox', 'DropDown')
) x

UPDATE task
SET ModifyDate = GETUTCDATE(),
	ModifyUser = 'migration 20170510162000',
	ContactKey = company.ContactId
FROM CRM.Task task
JOIN CRM.Contact report ON task.ContactKey = report.ContactId AND report.ContactType = 'VisitReport'
LEFT JOIN CRM.Contact company ON report.ParentKey = company.ContactId AND company.ContactType = 'Company'

UPDATE note
SET ModifyDate = GETUTCDATE(),
	ModifyUser = 'migration 20170510162000',
	ElementKey = company.ContactId
FROM CRM.Note note
JOIN CRM.Contact report ON note.ElementKey = report.ContactId AND report.ContactType = 'VisitReport'
LEFT JOIN CRM.Contact company ON report.ParentKey = company.ContactId AND company.ContactType = 'Company'
WHERE NoteType = 'VisitReportTopicNote'

DROP TABLE [CRM].[VisitReportAnswer]
DROP TABLE [CRM].[VisitReport]
UPDATE [CRM].[Contact] SET [IsActive] = 0 WHERE [ContactType] = 'VisitReport'
DROP TABLE [CRM].[VisitReportPossibleAnswer]
DROP TABLE [CRM].[VisitReportQuestion]
UPDATE [CRM].[DynamicForm] SET [Description] = NULL WHERE [CategoryKey] = 'VisitReport'
");
			}
		}
	}
}
