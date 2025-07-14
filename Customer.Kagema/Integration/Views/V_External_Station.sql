SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_Station]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_Station] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_Station]
AS
SELECT
	rc.[Name 2] COLLATE DATABASE_DEFAULT AS [Name]
	,1 AS [IsActive]
	,rc.[Code] AS [LegacyId]
	,rc.[Address] AS [Street]
	,rc.[Post Code] AS [PostCode]
	,BINARY_CHECKSUM(
		rc.[Name 2]
		,rc.[Code]
		,rc.[Address]
		,rc.[Address] 
		
	) AS [LegacyVersion]
FROM [S].External_Station rc WITH (READUNCOMMITTED)
WHERE rc.[Code] <> '99'
GO