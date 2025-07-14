SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_User]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_User] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW  [V].[External_User]
AS
	SELECT 
		i.[No_] AS [LegacyId]
		,i.[No_] AS [PersonnelId]
		,LEFT(i.[Name], case when  CHARINDEX(' ', i.[Name] ) = 0 then LEN(i.[Name]) else CHARINDEX(' ', i.[Name]) -1 end) AS [FirstName]
		,RIGHT(i.[Name], (len(i.[Name]) - charindex(' ', i.[Name]) + 1)) AS [LastName]
		,i.[Resource Group No_]
		,REPLACE(
			REPLACE(
			REPLACE(
            REPLACE(
            REPLACE(
            REPLACE(
            REPLACE(
            REPLACE(
            REPLACE(LOWER(i.[Name])
            , 'Ä', 'AE')
            , 'Ö', 'OE')
            , 'Ü', 'UE')
            , 'ä', 'ae')
            , 'ö', 'oe')
            , 'ü', 'ue')
            , 'ß', 'ss')
			, ' ', '.')
			, '..', '.')
		AS [Username]
		,e.[Company E-Mail] AS [Email]
	 FROM [S].[External_Resource] i
	 LEFT JOIN [S].[External_Employee] e ON e.[No_] = i.[No_] and COALESCE(i.[Name],'') <>''
	WHERE i.[Type] = 0 
	--and i.[Resource Group No_] in ('MONTEURE-HPT', 'MONTEURE-EXT', 'DISPO', 'ERP-ADMIN')

GO

