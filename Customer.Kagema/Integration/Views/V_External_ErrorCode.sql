SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_ErrorCode]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_ErrorCode] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_ErrorCode]
AS
SELECT 
--update code instead name temporary because name is empty
	[Description] COLLATE DATABASE_DEFAULT AS [Name]
	,'de' AS [Language]
	,[Code] COLLATE DATABASE_DEFAULT AS [Value]
	,[Fault Area Code] AS [FaultAreaCode]
	,[Symptom Code] AS [Code]
	,0 AS [Favorite]
	,0 AS [SortOrder]
	,BINARY_CHECKSUM(
	[Description]
		,[Code]
		,[Fault Area Code]
		,[Symptom Code]
	) AS [LegacyVersion]

FROM [S].[External_ErrorCode] WITH (READUNCOMMITTED)
WHERE  [Code] <> ''
UNION 
SELECT 
--update code instead name temporary because name is empty
	[Description] COLLATE DATABASE_DEFAULT AS [Name]
	,'en' AS [Language]
	,[Code] COLLATE DATABASE_DEFAULT AS [Value]
	,[Fault Area Code] AS [FaultAreaCode]
	,[Symptom Code] AS [Code]
	,0 AS [Favorite]
	,0 AS [SortOrder]
	,BINARY_CHECKSUM(
	[Description]
		,[Code]
		,[Fault Area Code]
		,[Symptom Code]
	) AS [LegacyVersion]

FROM [S].[External_ErrorCode] WITH (READUNCOMMITTED)
WHERE  [Code] <> ''
Go