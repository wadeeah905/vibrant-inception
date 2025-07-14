SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_ServiceOrder]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_ServiceOrder] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW  [V].[External_ServiceOrder]
AS
SELECT 
	sh.[No_] COLLATE DATABASE_DEFAULT AS OrderNo
	,NULL AS [Commission]
	,sh.[Customer No_] COLLATE DATABASE_DEFAULT AS NavisionCustomerNo
	, sh.[Service Order Type] AS [OrderTypeKey]
	,'ReadyForScheduling' AS [OrderStateKey]
	,COAlesce(sh.[Description], '') AS [ErrorMessage]
	,sh.[Priority] AS [Priority]
	,sh.[Order Date] AS [Reported]
	,NULL AS [Planned]
	,sh.[Due Date] AS [Deadline]
	,sh.[Ship-to Name] COLLATE DATABASE_DEFAULT AS [Name1]
	,sh.[Ship-to Name 2] AS [Name2]
	,NULL AS [Name3]
	,sh.[Ship-to City] COLLATE DATABASE_DEFAULT AS [City]
	,(CASE WHEN NULLIF(sh.[Ship-to Country_Region Code], '') IS NULL THEN 'DE' ELSE sh.[Ship-to Country_Region Code] END) AS [CountryKey]
	,sh.[Ship-to Post Code] COLLATE DATABASE_DEFAULT AS [ZipCode]
	,sh.[Ship-to Address] COLLATE DATABASE_DEFAULT AS [Street]
	,sh.[Responsibility Center] COLLATE DATABASE_DEFAULT AS [StationNo]
	,sh.[Your Reference] AS [PurchaseOrderNo]
	,sh.[Ship-to Phone] AS [ServiceLocationPhone]
	,sh.[Ship-to Phone 2] AS [ServiceLocationMobile]
	,sh.[Ship-to Fax No_] AS [ServiceLocationFax]
	,sh.[Ship-to E-Mail] AS [ServiceLocationEmail]
	,sh.[Ship-to Contact] AS [ServiceLocationResponsiblePerson]
	,sh.[Status] AS [Status]
	,spp.[Sort Name] AS [SalespersonName]
	,sh.[Ship-to code] AS [ShipToCode]
	,sh.[lmstatus] AS [lmstatus]
	,sh.[Anfahrtspauschale] AS [TravelFlateRate]
    ,sh.[Angebotspauschale] AS [OfferFlateRate]
	,sh.[13B] AS [Tag13B],
(Select SUBSTRING( 
(  SELECT ';;' + Comment 
         FROM [S].[External_ServiceCommentLine] scl where sh.No_=scl.No_ and [table Name]=1  and [table subtype]=1
and TYPE=1  FOR XML PATH('') 
), 1 , 9999) )As Remark
FROM S.External_ServiceHeader sh WITH (READUNCOMMITTED)
 JOIN [SMS].[ServiceOrderType] sot ON sot.[Value]
COLLATE DATABASE_DEFAULT  = sh.[Service Order Type] COLLATE DATABASE_DEFAULT 
AND sot.[Language] = 'de'

left join [S].[External_SalesPersonPurchaser] spp on spp.[Code]= sh.[salesperson code]

WHERE sh.[Document Type] = 1 and [Status] = 1 and [lmstatus]=1
--need to clarifz with customer
--WHERE sh.[Document Type] = 1 and [Status] = 2 and [lmstatus]=2
GO


 
