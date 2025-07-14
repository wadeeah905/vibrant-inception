-- Lookup Part


truncate table [LU].[DynamicFormLocalization]

-- Entity Part

delete from sms.ServiceOrderMaterialSerials
delete from [SMS].[ServiceOrderMaterial]
truncate table [SMS].[ServiceOrderTimePostings]
delete from [SMS].[ServiceOrderDispatch]
delete from sms.ServiceOrderChecklist
delete from  [SMS].[ServiceOrderTimes]
delete from [SMS].[ServiceOrderHead]
delete from crm.contact where contacttype='ServiceOrder'
delete from [CRM].[DynamicFormReference]
truncate table [CRM].[DynamicFormResponse]
delete from   [CRM].[DynamicFormElement]



delete from [RPL].[Dispatch]
truncate table [RPL].[DispatchTracking]


-- User Part (you can delete everything and create a new user in the system or just leave one like default user, but you should edit the name then)
--WHERE Username <> 'default.1'

delete from dbo.GrantedPermission
WHERE UserId <> '67B41E61-21EE-4678-9C7A-B10D8D35DBC4'
delete from dbo.GrantedRole
WHERE UserId <> '67B41E61-21EE-4678-9C7A-B10D8D35DBC4'
delete from dbo.PermissionSchemaRoleAssignment
WHERE UserId <> '67B41E61-21EE-4678-9C7A-B10D8D35DBC4'


delete from dbo.[User]
WHERE Username <> 'default.1'
--select * from crm.[user] where Username = 'default.1'  67B41E61-21EE-4678-9C7A-B10D8D35DBC4

delete from [CRM].[UserUserGroup]
where Username <> 'default.1'
delete from [CRM].[User]
WHERE Username <> 'default.1'


 


-- Truncation (complete empty tables)
TRUNCATE TABLE [CRM].[Log]
TRUNCATE TABLE [CRM].[Posting]




