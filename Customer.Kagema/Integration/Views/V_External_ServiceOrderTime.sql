SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'V.External_ServiceOrderTime'))
	EXEC sp_executesql N'CREATE VIEW V.External_ServiceOrderTime AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW V.External_ServiceOrderTime
AS
SELECT 
	header.[No_] COLLATE DATABASE_DEFAULT AS [OrderNo]
	,line.[Service Item No_] AS [InstallationNo]
	,line.[Line No_] AS [PosNo]
	,line.[Item No_] AS [ItemNo]
	,line.[Description] AS [Description]
	,line.[Description 2] AS [Comment]
	,BINARY_CHECKSUM(
		header.[No_]
		,line.[Line No_]
		,line.[Description]
		,line.[Description 2]
	) AS [LegacyVersion]
FROM S.External_ServiceItemLine line WITH (READUNCOMMITTED)
JOIN S.External_ServiceHeader header WITH (READUNCOMMITTED)
	ON line.[Document No_] = header.[No_]
	AND header.[Document Type] = 1
	and  header.[Status] = 1 and  header.[lmstatus]=1

GO
