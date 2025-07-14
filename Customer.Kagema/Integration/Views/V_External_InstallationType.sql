SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_InstallationType]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_InstallationType] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_InstallationType]
AS
SELECT 
--machine t
	sig.[Description] AS [Name]
	,'en' AS [Language]
	,sig.[Code] COLLATE DATABASE_DEFAULT AS [Value]
	,sig.[Code]  COLLATE DATABASE_DEFAULT AS [GroupKey]
	,0 AS [Favorite]
	,0 AS [SortOrder]
	,BINARY_CHECKSUM(
		'en'
		,sig.[Description]
		,sig.[Code] 
	) AS [LegacyVersion]
FROM [S].[External_ServiceItemGroup] sig WITH (READUNCOMMITTED)

UNION ALL
SELECT 
--machine t
	sig.[Description] AS [Name]
	,'de' AS [Language]
	,sig.[Code] COLLATE DATABASE_DEFAULT AS [Value]
	,sig.[Code]  COLLATE DATABASE_DEFAULT AS [GroupKey]
	,0 AS [Favorite]
	,0 AS [SortOrder]
	,BINARY_CHECKSUM(
		'en'
		,sig.[Description]
		,sig.[Code] 
	) AS [LegacyVersion]
FROM [S].[External_ServiceItemGroup] sig WITH (READUNCOMMITTED)

GO