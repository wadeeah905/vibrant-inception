SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_Person]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_Person] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_Person]
AS
SELECT 
	c.[No_] COLLATE DATABASE_DEFAULT AS [PersonNo]
	,contactBR.[No_] COLLATE DATABASE_DEFAULT AS [CompanyNo]
	,NULLIF(c.[Salesperson Code], '') COLLATE DATABASE_DEFAULT AS [ResponsibleUser]
	,ISNULL(NULLIF(c.[First Name], N''), CHAR(1)) AS [Firstname]
	,NULLIF(c.[Surname], '') As [Lastname]
	,NULLIF(c.[Organizational Level Code],  '') AS [OrganizationalLevelCode]
	,ol.[Description] AS [OrganizationalLevelDescription]
	,CASE 
		WHEN c.[Salutation Code] = 'M' THEN 'MANN'
		WHEN c.[Salutation Code] = 'W' THEN 'FRAU'
		ELSE ''
	END AS [SalutationCode]
	,c.[Job Title] AS [BusinessTitle]
	,'2' AS [Visibility]
	,'de' AS [Language]
	,BINARY_CHECKSUM(
		c.[No_]
		,c.[Company No_]
		,c.[First Name]
		,c.[Surname]
		,c.[Organizational Level Code]
		,ol.[Description]
		,c.[Salutation Code]
		,c.[Job Title]
		,parent.[No_]
	) AS [LegacyVersion]
FROM [S].[External_Contact] c
JOIN [S].[External_Contact] parent WITH (READUNCOMMITTED) ON parent.[No_] = c.[Company No_]
JOIN [S].[External_ContactBusinessRelation] contactBR ON parent.[No_] COLLATE DATABASE_DEFAULT = contactBR.[Contact No_] COLLATE DATABASE_DEFAULT
LEFT OUTER JOIN [S].[External_OrganizationalLevel] ol ON c.[Organizational Level Code] = ol.[Code]
	WHERE c.[Type] = 1
		AND NULLIF(c.[Name], '') IS NOT NULL
		AND (NULLIF(c.[First Name], '') IS NOT NULL OR NULLIF(c.[Surname],'') IS NOT NULL)

GO




