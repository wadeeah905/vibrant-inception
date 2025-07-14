SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_Article]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_Article] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_Article] AS
SELECT i.[No_] AS [ItemNo] 
	,i.[Description] + ' ' + i.[Description 2] AS [FullDescription]
	, i.[Description 2] As [Description 2]
	,'Material' AS [ArticleType]
	,[Item Category Code] as [CategoryCode]
	,[Unit Cost] AS [Price]
	,UPPER([Sales Unit of Measure]) AS [UnitOfMeasure]
	,null AS [lumpsum]
	,i.[Shelf No_] AS [ShelfNo]
	,i.[Vendor No_] AS [VendorNo]
	,BINARY_CHECKSUM(
		i.[No_]
		,i.[Description]
		,i.[Description 2]
		,i.[Item Category Code]
		,UPPER([Sales Unit of Measure])
		,i.[Shelf No_]
		,i.[Vendor No_]) AS LegacyVersion
FROM [S].[External_Item] i
--JOIN [S].[External_UnitOfMeasure] u ON u.[Code] = i.[Base Unit of Measure]
WHERE [Blocked] = 0 and i.[Type] <> 1 
--and ((SUBSTRING(UPPER(i.[Shelf No_]),1,1)   in ('M','H','E','V'))
--OR (i.[No_]in ('ZUSATZMAT') ))
UNION ALL
SELECT i.[Code] AS [ItemNo] 
	,i.[Description] AS [FullDescription]
	, null As [Description 2]
	,'Service' AS [ArticleType]
	,null as [CategoryCode]
	,null AS [Price]
	,UPPER(u.[Code]) AS [UnitOfMeasure]
	,i.[Pauschale] AS [lumpsum]
	,null AS [ShelfNo]
	,null AS [VendorNo]
	,BINARY_CHECKSUM(
		i.[Code]
		,i.[Description]
		,UPPER(u.[Code])
		,i.[Pauschale]) AS LegacyVersion
FROM [S].[External_WorkType] i
JOIN [S].[External_UnitOfMeasure] u ON u.[Code] = i.[Unit of Measure Code]

GO

