SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_Company]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_Company] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_Company]
AS

SELECT
	c.[No_] AS [CompanyNo]
	,(CASE WHEN NULLIF(c.[Language Code], '') IS NULL THEN 'DE' 
	when c.[Language Code]='DEU' THEN 'DE'
	when c.[Language Code]='ENU' THEN 'EN'
	ELSE c.[Language Code] END)
	AS [ContactLanguage]
	,'Company' AS [ContactType]
	,'101' AS [CompanyTypeKey]
	,SUBSTRING(c.[Name] + ' ' + c.[Name 2], 0, 450) AS [Name]
	,SUBSTRING(c.[Name] + ' ' + c.[Name 2], 0, 120) AS [ShortText]
	,SUBSTRING(c.[Name] + ' ' + c.[Name 2], 0, 30) AS [SearchText]
	,0 AS [IsOwnCompany]
	,NULL AS [GroupFlag1Key]
	,NULL AS [GroupFlag2Key]
	,NULL AS [GroupFlag3Key]
	,NULL AS [GroupFlag4Key]
	,NULL AS [GroupFlag5Key]
	,NULLIF(c.[Bill-to Customer No_], '') AS [BillToCustomerNo]
	,cb.[Industry Group Code] as [BranchKey]
	,c.[Customer Price Group] as [CustomerPriceGroup]
	,BINARY_CHECKSUM(
		c.[No_]
		,c.[Name]
		,c.[Name 2]
		,c.[Search Name]
		,c.[Bill-to Customer No_]
		,c.[Customer Price Group]
	) AS [LegacyVersion]
FROM [S].[External_Customer] c
LEFT OUTER JOIN [S].[External_CompanyBranches] cb ON c.[No_] = cb.[Contact No_]
WHERE 1=1
	AND (c.[Name] <> '' OR c.[Name 2] <> '')
	AND c.No_ IN (SELECT DISTINCT No_ FROM [S].[External_ContactBusinessRelation] WHERE [Business Relation Code] = 'DEB')

GO