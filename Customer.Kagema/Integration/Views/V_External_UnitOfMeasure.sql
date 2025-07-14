SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_UnitOfMeasure]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_UnitOfMeasure] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_UnitOfMeasure]
AS
SELECT [Description] AS [Name]
		,'de' AS [Language]
		,UPPER([Code]) COLLATE database_default AS [Value]
		,NULL AS [GroupKey]
		,0 AS [Favorite]
		,0 AS [SortOrder]
FROM [S].[External_UnitOfMeasure]
WHERE NULLIF([Description] ,'') IS NOT NULL

UNION ALL
SELECT [Description]
		,'en'
		,UPPER([Code]) COLLATE database_default
		,NULL
		,0
		,0
FROM [S].[External_UnitOfMeasure]
WHERE  NULLIF([Description] ,'') IS NOT NULL 

GO

