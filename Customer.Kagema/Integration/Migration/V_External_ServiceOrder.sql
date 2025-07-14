SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_ServiceOrder_Migration]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_ServiceOrder_Migration] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_ServiceOrder_Migration]
AS
SELECT 
	sh.[No_] COLLATE DATABASE_DEFAULT AS OrderNo
	,NULL AS [Commission]
	,sh.[Customer No_] COLLATE DATABASE_DEFAULT AS NavisionCustomerNo
	,sot.[Value] AS [OrderTypeKey]
	,'ReadyForScheduling' AS [OrderStateKey]
	,COAlesce(sh.[Description], '') AS [ErrorMessage]
	,sh.[Priority] AS [Priority]
	,sh.[Order Date] AS [Reported]
	,NULL AS [Planned]
	,sh.[Due Date] AS [Deadline]
	,sh.[Name] COLLATE DATABASE_DEFAULT AS [Name1]
	,NULL AS [Name2]
	,NULL AS [Name3]
	,sh.[City] COLLATE DATABASE_DEFAULT AS [City]
	,NULL AS [CountryKey]
	,sh.[Post Code] COLLATE DATABASE_DEFAULT AS [ZipCode]
	,sh.[Address] COLLATE DATABASE_DEFAULT AS [Street]
	,sh.[Responsibility Center] COLLATE DATABASE_DEFAULT AS [StationNo]
	,sh.[Your Reference] AS [PurchaseOrderNo]
	,sh.[Phone No_] AS [ServiceLocationPhone]
	,sh.[Phone No_ 2] AS [ServiceLocationMobile]
	,sh.[Fax No_] AS [ServiceLocationFax]
	,sh.[E-Mail] AS [ServiceLocationEmail]
	,sh.[Contact Name] AS [ServiceLocationResponsiblePerson]
	,sh.[Status] AS [Status]
	,sh.[Pers_ Responsible Troublesh_] As [Troubleshooter] 
	,sh.[Repair Status Code] As [RepairStatusCode]
FROM S.External_ServiceHeader sh WITH (READUNCOMMITTED)
JOIN [SMS].[ServiceOrderType] sot ON sot.[Value] COLLATE DATABASE_DEFAULT  = sh.[Service Order Type] COLLATE DATABASE_DEFAULT  AND sot.[Language] = 'de'
join [LU].[RepairStatus] rs on rs.[Value] COLLATE DATABASE_DEFAULT  = sh.[Repair Status Code] COLLATE DATABASE_DEFAULT  AND rs.[Language] = 'de'
WHERE sh.[Document Type] = 1 


UNION ALL
SELECT 
	sh.[No_] COLLATE DATABASE_DEFAULT AS OrderNo
	,NULL AS [Commission]
	,sh.[Customer No_] COLLATE DATABASE_DEFAULT AS NavisionCustomerNo
	,'Default' AS [OrderTypeKey]
	,'ReadyForScheduling' AS [OrderStateKey]
	,COAlesce(sh.[Description], '') AS [ErrorMessage]
	,sh.[Priority] AS [Priority]
	,sh.[Order Date] AS [Reported]
	,NULL AS [Planned]
	,sh.[Due Date] AS [Deadline]
	,sh.[Name] COLLATE DATABASE_DEFAULT AS [Name1]
	,NULL AS [Name2]
	,NULL AS [Name3]
	,sh.[City] COLLATE DATABASE_DEFAULT AS [City]
	,NULL AS [CountryKey]
	,sh.[Post Code] COLLATE DATABASE_DEFAULT AS [ZipCode]
	,sh.[Address] COLLATE DATABASE_DEFAULT AS [Street]
	,sh.[Responsibility Center] COLLATE DATABASE_DEFAULT AS [StationNo]
	,sh.[Your Reference] AS [PurchaseOrderNo]
	,sh.[Phone No_] AS [ServiceLocationPhone]
	,sh.[Phone No_ 2] AS [ServiceLocationMobile]
	,sh.[Fax No_] AS [ServiceLocationFax]
	,sh.[E-Mail] AS [ServiceLocationEmail]
	,sh.[Contact Name] AS [ServiceLocationResponsiblePerson]
	,sh.[Status] AS [Status]
	,sh.[Pers_ Responsible Troublesh_] As [Troubleshooter] 
	,sh.[Repair Status Code] As [RepairStatusCode]
FROM S.External_ServiceHeader sh WITH (READUNCOMMITTED)
join [LU].[RepairStatus] rs on rs.[Value] COLLATE DATABASE_DEFAULT  = sh.[Repair Status Code] COLLATE DATABASE_DEFAULT  AND rs.[Language] = 'de'
--JOIN [SMS].[ServiceOrderType] sot ON sot.[Value] COLLATE DATABASE_DEFAULT  = sh.[Service Order Type] COLLATE DATABASE_DEFAULT  AND sot.[Language] = 'de'
WHERE sh.[Service Order Type]='' AND sh.[Document Type] = 1


GO