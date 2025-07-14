SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID('[dbo].[SP_AppendResult]'))
DROP PROCEDURE [dbo].[SP_AppendResult]
GO
CREATE PROCEDURE [dbo].[SP_AppendResult]
	@displayName AS NVARCHAR(100),
	@tableName AS NVARCHAR(100),
	@log AS VARCHAR(MAX) OUTPUT,
	@lastTime AS DATETIME = NULL OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @sql NVARCHAR(400);
	DECLARE @count BIGINT;
	DECLARE @change AS NVARCHAR(100);
	DECLARE @result NVARCHAR(100);
	SET @result = @displayName + ': ';

	SET @sql = 'SELECT @count = COUNT(*) FROM ' + @tableName + ' WHERE Change = @change '

	SET @change = 'INSERT'
	EXECUTE sp_executesql @sql, N'@change NVARCHAR(100), @count BIGINT OUTPUT', @change = @change, @count = @count OUTPUT
	SET @result = @result + @change + ' (' + CONVERT(NVARCHAR(15), @count) + '), '

	SET @change = 'UPDATE'
	DECLARE @updates NVARCHAR(400) = @sql + ' AND IsActive <> 0'
	EXECUTE sp_executesql @updates, N'@change NVARCHAR(100), @count BIGINT OUTPUT', @change = @change, @count = @count OUTPUT
	SET @result = @result + @change + ' (' + CONVERT(NVARCHAR(15), @count) + '), '

	SET @change = 'UPDATE'
	DECLARE @softDeletes NVARCHAR(400) = @sql + ' AND IsActive = 0'
	EXECUTE sp_executesql @softDeletes, N'@change NVARCHAR(100), @count BIGINT OUTPUT', @change = @change, @count = @count OUTPUT
	SET @result = @result + 'SOFT DELETE' + ' (' + CONVERT(NVARCHAR(15), @count) + '), '

	SET @change = 'DELETE'
	EXECUTE sp_executesql @sql, N'@change NVARCHAR(100), @count BIGINT OUTPUT', @change = @change, @count = @count OUTPUT
	SET @result = @result + @change + ' (' + CONVERT(NVARCHAR(15), @count) + ') '

	EXEC SP_AppendNewLine @log OUTPUT, @result, @lastTime OUTPUT;
END

GO