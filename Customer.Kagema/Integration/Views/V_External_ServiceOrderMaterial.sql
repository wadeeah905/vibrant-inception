SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'V.External_ServiceOrderMaterial'))
	EXEC sp_executesql N'CREATE VIEW V.External_ServiceOrderMaterial AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_ServiceOrderMaterial]
AS
SELECT 
	*
	,0 AS [CommissioningStatus] --temporary in order to progress
	,BINARY_CHECKSUM(
		OrderNo
		,[PosNo]
		,[ItemNo]
		,[Type]
		,[Description]
		,[UnitOfMeasure]
		,[EstimatedQuantity]
		,[ServiceOrderTime]
		,CommissionedQuantity
		,[Calculate]
		,[OnReport]
		,[ShelfNo]
	) AS [LegacyVersion]
FROM 
(
	SELECT
		 header.[No_] COLLATE DATABASE_DEFAULT AS OrderNo
		,CONVERT(NVARCHAR(MAX), line.[Line No_]) COLLATE DATABASE_DEFAULT AS [PosNo]
		,line.[No_] COLLATE DATABASE_DEFAULT AS [ItemNo]
		,line.[Type] AS [Type]
		,line.[Description]+' '+line.[Description 2] AS [Description]
		,line.[Unit of Measure] AS [UnitOfMeasure]
		,line.[Quantity] AS [EstimatedQuantity]
		,line.[Service Item Line No_] AS [ServiceOrderTime]
		,SUM(receiptLine.[Quantity]) AS CommissionedQuantity
		,coalesce(line.[Berechnen],0) AS [Calculate]
		,line.[Summe] AS [OnReport]
		,line.[ShelfNo] AS [ShelfNo]
	FROM S.External_ServiceLine line WITH (READUNCOMMITTED)
	JOIN S.External_ServiceHeader header WITH (READUNCOMMITTED) ON line.[Document No_] = header.[No_]
	JOIN S.External_ServiceItemLine sil WITH (READUNCOMMITTED) ON sil.[Document No_] = header.[No_]
	JOIN S.External_Item item WITH (READUNCOMMITTED) ON line.[No_] = item.[No_]
	LEFT OUTER JOIN S.External_TransferReceiptLine receiptLine WITH (READUNCOMMITTED) 
		ON line.[Document No_] = receiptLine.[Document No_] 
		AND receiptLine.[Item No_] = line.[No_]
	WHERE header.[Document Type] = 1
	AND line.[Type]='1'
	and ( line.[Berechnen]=1 or line.[ShelfNo] <> '')
		AND sil.[Service Item No_] <> ''
		--and header.[Status] = 1 and header.[lmstatus]=1
	GROUP BY header.[No_]
		,line.[Line No_]
		,line.[No_]
		,line.[Type]
		,line.[Description]
		,line.[Description 2]
		,line.[Unit of Measure]
		,line.[Quantity]
		,line.[Service Item Line No_]
		,line.[Berechnen]
		,line.[Summe]
		,line.[ShelfNo]
) T

GO