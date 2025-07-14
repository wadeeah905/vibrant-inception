SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_Country]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_Country] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_Country] 
AS
SELECT  [Name]
		,'de' AS [Language]
		,UPPER([Code]) COLLATE database_default AS [Value]
		,NULL AS [GroupKey]
		,0 AS [Favorite]
		,0 AS [SortOrder]
FROM [S].[External_Country_Region]
WHERE [Code] IS NOT NULL

UNION ALL
SELECT  [Name]
		,'en' AS [Language]
		,UPPER([Code]) COLLATE database_default AS [Value]
		,NULL AS [GroupKey]
		,0 AS [Favorite]
		,0 AS [SortOrder]
FROM [S].[External_Country_Region]
WHERE [Code] IS NOT NULL

GO

