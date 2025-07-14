SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_Address_Installation]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_Address_Installation] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_Address_Installation]
AS
SELECT
	('Installation|'+ si.[Customer No_] +'|' +si.[No_])
		COLLATE DATABASE_DEFAULT AS [LegacyId]
	, si.[No_] COLLATE DATABASE_DEFAULT AS [InstallationNo]
	,3 AS [AddressTypeKey]

	,(case when si.[ErfStandort]=1 then si.[Customer No_]
		else ship.[Customer No_]
		end) COLLATE DATABASE_DEFAULT AS [CompanyNo]

	,(case when si.[ErfStandort]=1 then si.[Ship-to Code] + '-' + si.[Customer No_] 
		else ship.[Code] + '-' + ship.[Customer No_] 
		end) COLLATE DATABASE_DEFAULT AS [ShipToCode]

	,0 AS [IsCompanyStandardAddress]

	,(case when si.[ErfStandort]=1  then SUBSTRING(si.[ESOName], 0, 450) 
		else SUBSTRING(ship.[Name], 0, 450) 
		end) COLLATE DATABASE_DEFAULT AS [Name1]

	,(case when si.[ErfStandort]=1  then SUBSTRING(si.[ESOKontakt], 0, 450) 
		else SUBSTRING(NULLIF(ship.[Name 2], ''), 0, 180) 
		end) COLLATE DATABASE_DEFAULT AS [Name2]

	,NULL AS [Name3]
	,NULL AS [Email]

	,(case when si.[ErfStandort]=1  then SUBSTRING(COALESCE(NULLIF(si.[ESOAdresse], ''), si.[ESOAdresse2]), 0, 4000) 
		else SUBSTRING(COALESCE(NULLIF(ship.[Address], ''), ship.[Address 2]), 0, 4000)
		end) COLLATE DATABASE_DEFAULT AS [Street]

	,(case when si.[ErfStandort]=1  then SUBSTRING(si.[ESOOrt], 0, 80) 
		else SUBSTRING(ship.[city], 0, 80) 
		end) COLLATE DATABASE_DEFAULT AS [City]

	,(case when si.[ErfStandort]=1  then SUBSTRING(si.[ESOPLZ], 0, 20) 
		else SUBSTRING(ship.[Post Code], 0, 20) 
		end) COLLATE DATABASE_DEFAULT AS [ZipCode]

	,NULL AS [POBox]
	,NULL AS [ZipCodePOBox]
	,'DE' AS [CountryCode]
	,NULL AS [RegionKey]
	,si.[ErfStandort] AS [ErfStandort]

	,(case when si.[ErfStandort]=1  then si.[ESOKontakt]
		else ship.[Contact]
		end) COLLATE DATABASE_DEFAULT AS [Contactname]

	,(case when si.[ErfStandort]=1  then si.[ESOTelefon]
		else ship.[Phone No_]
		end) COLLATE DATABASE_DEFAULT AS [ContactTelefon]

	, BINARY_CHECKSUM(
		ship.[Customer No_]
		,ship.[Name]
		,ship.[Name 2]
		,ship.[Address]
		,ship.[Address 2]
		,ship.[city]
		,ship.[Post Code]
		,si.[ErfStandort] 
		,ship.[Contact]
		,ship.[Phone No_]
		,si.[ESOName]
		,si.[ESOAdresse]
		,si.[ESOAdresse2]
		,si.[ESOOrt]
		,si.[ESOPLZ]
		,si.[ErfStandort] 
		,si.[ESOKontakt]
		,si.[ESOTelefon]
	) AS [LegacyVersion]
FROM [S].[External_ServiceItem] si
LEFT JOIN [S].[External_ShipToAddress] ship 
ON si.[Customer No_]=ship.[Customer No_] AND si.[ship-to Code]=ship.[Code]
WHERE NULLIF(si.[Customer No_],'') IS NOT NULL
--and si.[ErfStandort]=1  