SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[V].[External_ServiceCommentLine]'))
	EXEC sp_executesql N'CREATE VIEW [V].[External_ServiceCommentLine] AS SELECT ''This is a code stub which will be replaced by an Alter Statement'' as [code_stub]'
GO

ALTER VIEW [V].[External_ServiceCommentLine]
AS
SELECT * 
FROM (
	SELECT 
	commentLine.[No_]  COLLATE DATABASE_DEFAULT  As [InstallationNo]
     ,CONVERT(nvarchar(10),commentLine.[Type]) as [Type]  
     ,CONVERT(nvarchar(10),commentLine.[Line No_] ) As [NoteLineNo]
     ,commentLine.[comment] As [Text]
	 ,commentLine.[No_]+CONVERT(nvarchar(10),commentLine.[Type])+ CONVERT(nvarchar(10),commentLine.[Line No_] )As LegacyId 
	 --,commentLine.[Date] As [TextDate]
	, (case commentLine.[Date]  when '1753-01-01 00:00:00.000' then null else commentLine.[Date]  end) As [TextDate]
	 ,commentLine.[Monteur] AS [CreateUser]
	-- ,(select top 1 scl.[Line No_] from  
 -- [S].[External_ServiceCommentLine]  scl
 --where scl.[Line No_]<= commentLine.[Line No_] 
 --and scl.[Monteur] !='' 
 --and scl.[Date] !='1753-01-01 00:00:00.000'
 --and commentLine.[No_]=scl.[No_]
 --order by [Line No_]  desc
 --) AS groupComment
	FROM [S].[External_ServiceCommentLine] commentLine 
	where (
	commentLine.[Type]=0 and 
	commentLine.[Table Name]=2 and 
	commentLine.[Table Subtype]=0 and 
	coalesce([No_],'') <>''
	)	

) T
