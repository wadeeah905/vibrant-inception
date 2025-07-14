SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_ServiceOrderType]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_ServiceOrderType] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO
--color red #FF0000 
--color yellow #F0FF00
--color blue #008DFF
-- color pink #FF00CC
ALTER VIEW [V].[External_ServiceOrderType]
AS
SELECT 
	[Description] AS [Name]
	,'de' AS [Language]
	,[Code] As [Value]
	,(case  
	when [Code] in ('8','C','H' ) then  '#FF00CC'
	when [Code] in ('0','03') then '#F0FF00'
	when [Code] in ('4','D' ) then '#008DFF'
	else '#9E9E9E' end) AS [Color]
FROM [S].[External_ServiceOrderType]
where [Code] IS NOT NULL AND [Code] <>''

UNION ALL
SELECT 
	[Description] AS [Name]
	,'en' AS [Language]
	,[Code] As [Value]
	,(case  
	when [Code] in ('8','C','H' ) then  '#FF00CC'
	when [Code] in ('0','03') then '#F0FF00'
	when [Code] in ('4','D' ) then '#008DFF'
	else '#9E9E9E' end) AS [Color]
FROM [S].[External_ServiceOrderType]
where [Code] IS NOT NULL AND [Code] <>''

UNION ALL
SELECT 
	[Description] AS [Name]
	,'de' AS [Language]
	,'Default' As [Value]
	,(case  
	when [Code] in ('8','C','H' ) then  '#FF00CC'
	when [Code] in ('0','03') then '#F0FF00'
	when [Code] in ('4','D' ) then '#008DFF'
	else '#9E9E9E' end) AS [Color]
FROM [S].[External_ServiceOrderType]
where [Code] =''

UNION ALL
SELECT 
	[Description] AS [Name]
	,'en' AS [Language]
	,'Default' As [Value]
	,(case  
	when [Code] in ('8','C','H' ) then  '#FF00CC'
	when [Code] in ('0','03') then '#F0FF00'
	when [Code] in ('4','D' ) then '#008DFF'
	else '#9E9E9E' end) AS [Color]
FROM [S].[External_ServiceOrderType]
where  [Code] =''
