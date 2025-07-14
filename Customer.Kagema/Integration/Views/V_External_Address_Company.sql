SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_Address_Company]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_Address_Company] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_Address_Company]
AS
SELECT 
	'Company|'+c.[No_] AS [AddressNo]
	,1 AS [AddressTypeKey]
	,c.[No_] AS [CompanyNo]
	,1 AS [IsCompanyStandardAddress]
	,SUBSTRING(c.[Name], 0, 450) AS [Name1]
	,SUBSTRING(NULLIF(c.[Name 2], ''), 0, 180) AS [Name2]
	,NULL AS [Name3]
	,NULLIF(c.[E-Mail],'') AS [Email]
	,SUBSTRING(COALESCE(NULLIF(c.[Address], ''), c.[Address 2]), 0, 4000) AS [Street]
	,SUBSTRING(c.[City], 0, 80) AS [City]
	,SUBSTRING(c.[Post Code], 0, 20) AS [ZipCode]
	,NULL AS [POBox]
	,NULL AS [ZipCodePOBox]
	,(CASE WHEN NULLIF(c.[Country_Region Code], '') IS NULL THEN 'DE' ELSE c.[Country_Region Code] END) AS [CountryCode]
	,NULLIF(c.[County], '') AS [RegionKey]
	,BINARY_CHECKSUM(
		c.[No_]
		,c.[Name]
		,c.[Name 2]
		,c.[Address]
		,c.[Address 2]
		,c.[City]
		,c.[Post Code]
		,c.[Country_Region Code]
		,c.[County]
		,c.[E-Mail]
	) AS [LegacyVersion]
FROM [S].[External_Customer] c
WHERE c.Blocked = 0 
	AND c.No_ IN (SELECT DISTINCT No_ FROM [S].[External_ContactBusinessRelation] WHERE [Business Relation Code] = 'DEB')
