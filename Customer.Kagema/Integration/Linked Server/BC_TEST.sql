USE [master]
GO

/****** Object:  LinkedServer [BC_TEST]    Script Date: 08.06.2022 16:44:55 ******/
EXEC master.dbo.sp_addlinkedserver @server = N'BC_TEST', @srvproduct=N'14.0.3192.2', @provider=N'SQLNCLI', @datasrc=N'192.168.200.3', @catalog=N'mi-kagema-test_14'
 /* For security reasons the linked server remote logins password is changed with ######## */
EXEC master.dbo.sp_addlinkedsrvlogin @rmtsrvname=N'BC_TEST',@useself=N'False',@locallogin=NULL,@rmtuser=N'sql_l-mobile',@rmtpassword='########'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'collation compatible', @optvalue=N'false'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'data access', @optvalue=N'true'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'dist', @optvalue=N'false'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'pub', @optvalue=N'false'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'rpc', @optvalue=N'false'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'rpc out', @optvalue=N'false'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'sub', @optvalue=N'false'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'connect timeout', @optvalue=N'0'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'collation name', @optvalue=null
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'lazy schema validation', @optvalue=N'false'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'query timeout', @optvalue=N'0'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'use remote collation', @optvalue=N'true'
GO

EXEC master.dbo.sp_serveroption @server=N'BC_TEST', @optname=N'remote proc transaction promotion', @optvalue=N'true'
GO


