SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_Installation]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_Installation] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_Installation]
AS
SELECT DISTINCT
	serviceItem.[No_] COLLATE DATABASE_DEFAULT AS [InstallationNo]
	,serviceItem.[Serial No_] AS [LegacyInstallationId]
	,NULL AS [Commission]
	,serviceItem.[Description]
	,serviceItem.[Service Item Group code] AS [InstallationType]
	,(case serviceItem.[Installation Date]  when '1753-01-01 00:00:00.000' then null else serviceItem.[Installation Date]  end) As [KickOffDate]
	,(case serviceItem.[Warranty Starting Date (Labor)] when '1753-01-01 00:00:00.000' then null else serviceItem.[Warranty Starting Date (Labor)] end) As [WarrantyFrom]
	,(case serviceItem.[Warranty Ending Date (Labor)] when '1753-01-01 00:00:00.000' then null else serviceItem.[Warranty Ending Date (Labor)] end) As [WarrantyUntil]
	,serviceItem.[Customer No_] COLLATE DATABASE_DEFAULT AS NavisionCustomerNo
	,NULL AS [LocationNo]
	,NULL AS [Room]
	,[Status] As [Status]
	,serviceItem.[ship-to Code] AS ShipToCode
	,serviceItem.[Item No_] As [CustomInstallationType]
	, serviceItem.[Motor_Typ]  AS [MotorTyp]
	, serviceItem.[Motor_Nummer]  AS [MotorNummer]
	, serviceItem.[Generator_Typ]  AS [GeneratorTyp]
	, serviceItem.[Generator_Nummer]  AS [GeneratorNummer]
	, serviceItem.[Pumpe_Typ]  AS [PumpeTyp]
	, serviceItem.[Pumpe_Nummer]  AS [PumpeNummer]
	,NULLIF(serviceItem.[Location of Service Item], '') COLLATE DATABASE_DEFAULT AS [StationLegacyId]
	,NULLIF(serviceItem.[Location of Service Item], '') COLLATE DATABASE_DEFAULT AS [KagemaLocation]
	,serviceItem.[ErfStandort] AS [ErfStandort]

	,(case when serviceItem.[ErfStandort]=1  then serviceItem.[ESOKontakt] 
	else ship.[Contact]
	end) COLLATE DATABASE_DEFAULT AS [ExternalReference]

	,(case when serviceItem.[ErfStandort]=1  then serviceItem.[ESOTelefon]
		else ship.[Phone No_]
		end) COLLATE DATABASE_DEFAULT AS [ExactPlace]
FROM [S].[External_ServiceItem] serviceItem WITH (READUNCOMMITTED)
LEFT JOIN [S].[External_ShipToAddress] ship 
ON serviceItem.[Customer No_]=ship.[Customer No_] AND serviceItem.[ship-to Code]=ship.[Code]
LEFT JOIN [S].[External_Customer] customer WITH (READUNCOMMITTED) 
ON customer.[No_] = COALESCE(NULLIF(serviceItem.[Customer No_], ''), serviceItem.[Customer No_]) 
AND customer.[Blocked] = 0


GO