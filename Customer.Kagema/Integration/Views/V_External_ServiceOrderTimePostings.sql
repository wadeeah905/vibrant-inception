SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_ServiceOrderTimePostings]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_ServiceOrderTimePostings] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_ServiceOrderTimePostings]
AS
	SELECT 
		[Document No_] AS [OrderNo]
		,[Resource No_] AS [UserLegacyId]
		,[Service Item No_] AS [InstallationNo]
		,CAST([Allocated Hours] * 60 AS INTEGER) AS [DurationInMinutes]
		,[Allocation Date] AS [Date]
	FROM [S].[External_ServiceOrderAllocation]
	
GO