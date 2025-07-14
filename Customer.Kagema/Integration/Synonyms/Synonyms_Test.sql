CREATE PROCEDURE CreateSynonym
	@sourceTable AS NVARCHAR(MAX)
	,@name AS NVARCHAR(MAX)
	,@database AS NVARCHAR(MAX) = '[BC_TEST].[mi-kagema-test_14].[dbo]'
AS
BEGIN
	DECLARE @drop AS NVARCHAR(MAX) = '
		IF EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(''[S].' + @name + '''))
		DROP SYNONYM [S].' + @name
	DECLARE @create AS NVARCHAR(MAX) = '
		CREATE SYNONYM [S].' + @name + ' FOR ' + @database + '.' + @sourceTable
	DECLARE @select AS NVARCHAR(MAX) = '
		SELECT TOP 1 * FROM [S].' + @name;

	EXEC sp_executesql @drop;
	EXEC sp_executesql @create;
	EXEC sp_executesql @select;
END
GO

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'S')
	EXEC ('CREATE SCHEMA [S]')
GO
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'I')
	EXEC ('CREATE SCHEMA [I]')
GO
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'V')
	EXEC ('CREATE SCHEMA [V]')
GO

EXEC CreateSynonym '[Service-Test$Contact Industry Group]', '[External_CompanyBranches]'
EXEC CreateSynonym '[Service-Test$Contact]', '[External_Contact]'
EXEC CreateSynonym '[Service-Test$Contact Business Relation]', '[External_ContactBusinessRelation]'
EXEC CreateSynonym '[Service-Test$Contact Industry Group]', '[External_ContactIndustryGroup]'
EXEC CreateSynonym '[Service-Test$Cost Object]', '[External_CostCenter]'
EXEC CreateSynonym '[Service-Test$Country_Region]', '[External_Country_Region]'
EXEC CreateSynonym '[Service-Test$Customer]', '[External_Customer]'
EXEC CreateSynonym '[Service-Test$Employee]', '[External_Employee]'
EXEC CreateSynonym '[Service-Test$Fault Code]', '[External_ErrorCode]'
EXEC CreateSynonym '[Service-Test$Fault Area]', '[External_FaultArea]'
EXEC CreateSynonym '[Service-Test$Item]', '[External_Item]'
EXEC CreateSynonym '[Service-Test$Item Ledger Entry]', '[External_ItemLedgerEntry]'
EXEC CreateSynonym '[Service-Test$Manufacturer]', '[External_Manufacturer]'
EXEC CreateSynonym '[Service-Test$Organizational Level]', '[External_OrganizationalLevel]'
EXEC CreateSynonym '[Service-Test$Repair Status]', '[External_RepairStatus]'
EXEC CreateSynonym '[Service-Test$Resource]', '[External_Resource]'
EXEC CreateSynonym '[Service-Test$Salesperson_Purchaser]', '[External_SalesPersonPurchaser]'
EXEC CreateSynonym '[Service-Test$Service Comment Line]', '[External_ServiceCommentLine]'
EXEC CreateSynonym '[Service-Test$Service Header]', '[External_ServiceHeader]'
EXEC CreateSynonym '[Service-Test$Service Item]', '[External_ServiceItem]'
EXEC CreateSynonym '[Service-Test$Service Item Component]', '[External_ServiceItemComponent]'
EXEC CreateSynonym '[Service-Test$Service Item Group]', '[External_ServiceItemGroup]'
EXEC CreateSynonym '[Service-Test$Service Item Line]', '[External_ServiceItemLine]'
EXEC CreateSynonym '[Service-Test$Service Line]', '[External_ServiceLine]'
EXEC CreateSynonym '[Service-Test$Service Order Allocation]', '[External_ServiceOrderAllocation]'
EXEC CreateSynonym '[Service-Test$Service Order Type]', '[External_ServiceOrderType]'
EXEC CreateSynonym '[Service-Test$Responsibility Center]', '[External_Station]'
EXEC CreateSynonym '[Service-Test$Transfer Receipt Header]', '[External_TransferReceiptHeader]'
EXEC CreateSynonym '[Service-Test$Unit of Measure]', '[External_UnitOfMeasure]'
EXEC CreateSynonym '[Service-Test$Transfer Receipt Line]', '[External_TransferReceiptLine]'
--EXEC CreateSynonym '[Service-Test$Service Header$e95c8ab0-19bd-468f-b2a4-a167177acdaa]', '[External_ServiceHeaderStatus]'
EXEC CreateSynonym '[Service-Test$Work Type]', '[External_WorkType]'
EXEC CreateSynonym '[Service-Test$Service Cost]', '[External_ServiceCost]'
EXEC CreateSynonym '[Service-Test$Ship-to Address]','[External_ShipToAddress]'

DROP PROCEDURE CreateSynonym