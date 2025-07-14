SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_ServiceItemComponent]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_ServiceItemComponent] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_ServiceItemComponent]
AS
SELECT
	
	[No_] COLLATE DATABASE_DEFAULT AS InstallationPosNo
	,[No_] COLLATE DATABASE_DEFAULT AS LegacyId
	,[Line No_] as [LineNo]
	,[Parent Service ITem No_] As InstallationNo
	,(Case [Type] 
	when 0 then 'ServiceItem'
	when 1 then 'Item'
	end) As InstallationPosType
	,[Date Installed]  AS [DateInstalled] 
	,[Serial No_] As [SerialNo]
	,[Description]+' '+[Description 2] As [Description]
	,BINARY_CHECKSUM(
		[No_]
		,[Line No_]
		,[Parent Service ITem No_]
		,[Type] 
		,[Date Installed]
		,[Serial No_] 
		,[Description]
		,[Description 2]
	) AS [LegacyVersion]
FROM S.External_ServiceItemComponent
where [Active]=1