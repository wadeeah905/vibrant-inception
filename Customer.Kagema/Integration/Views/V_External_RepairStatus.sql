SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_RepairStatus]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_RepairStatus] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_RepairStatus]
AS
SELECT 
	[Description] AS [Name]
	,'de' AS [Language]
	,[Code] As [Value]
FROM [S].[External_RepairStatus]
where [Code] IS NOT NULL AND [Code] <>''
 

UNION ALL
SELECT 
	[Description] AS [Name]
	,'en' AS [Language]
	,[Code] As [Value]
FROM [S].[External_RepairStatus]
where [Code] IS NOT NULL AND [Code] <>''


