SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_Communication]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_Communication] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_Communication]
AS
SELECT 
	CONVERT(NVARCHAR(50), 'Contact' + ContactNo) COLLATE DATABASE_DEFAULT AS AddressLegacyId
	,CONVERT(NVARCHAR(50), ContactNo) COLLATE DATABASE_DEFAULT AS NavisionContactNo
	,CONVERT(NVARCHAR(50), ContactNo) COLLATE DATABASE_DEFAULT AS CommunicationLegacyId
	,GroupKey
	,TypeKey
	,[Data]
	,NULL AS CountryKey
	,NULL AS AreaCode
FROM (
	SELECT 
		[No_] AS [ContactNo]
		,'Phone' AS [GroupKey]
		,'PhoneWork' AS [TypeKey]
		,NULLIF([Phone No_], '') AS [Data]
	FROM S.External_Contact WITH (READUNCOMMITTED)
	WHERE [Type] IN (0, 1)
		AND [No_] <> '' AND [No_] IS NOT NULL
		AND [Phone No_] <> '' AND [Phone No_] IS NOT NULL
	
	UNION ALL
	SELECT 
		[No_] AS [ContactNo]
		,'Phone' AS [GroupKey]
		,'PhoneMobile' AS [TypeKey]
		,NULLIF([Mobile Phone No_], '') AS [Data]
	FROM S.External_Contact WITH (READUNCOMMITTED)
	WHERE [Type] IN (0, 1)
		AND [No_] <> '' AND [No_] IS NOT NULL
		AND [Mobile Phone No_] <> '' AND [Mobile Phone No_] IS NOT NULL
	
	UNION ALL
	SELECT 
		[No_] AS [ContactNo]
		,'Email' AS [GroupKey]
		,'EmailWork' AS [TypeKey]
		,NULLIF([E-Mail], '') AS [Data]
	FROM S.External_Contact WITH (READUNCOMMITTED)
	WHERE [Type] IN (0, 1)
		AND [No_] <> '' AND [No_] IS NOT NULL
		AND [E-Mail] <> '' AND [E-Mail] IS NOT NULL
	
	UNION ALL
	SELECT 
		[No_] AS [ContactNo]
		,'Website' AS [GroupKey]
		,'WebsiteWork' AS [TypeKey]
		,NULLIF([Home Page], '') AS [Data]
	FROM S.External_Contact WITH (READUNCOMMITTED)
	WHERE [Type] IN (0, 1)
		AND [No_] <> '' AND [No_] IS NOT NULL
		AND [Home Page] <> '' AND [Home Page] IS NOT NULL
	
	UNION ALL
	SELECT 
		[No_] AS [ContactNo]
		,'Fax' AS [GroupKey]
		,'FaxWork' AS [TypeKey]
		,NULLIF([Fax No_], '') AS [Data]
	FROM S.External_Contact WITH (READUNCOMMITTED)
	WHERE [Type] IN (0, 1)
		AND [No_] <> '' AND [No_] IS NOT NULL
		AND [Fax No_] <> '' AND [Fax No_] IS NOT NULL
) T
GO