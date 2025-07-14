-- Lookup Part
truncate table [LU].[DynamicFormLocalization]

-- Entity Part
truncate table [CRM].[DocumentAttributes]
truncate table [CRM].[Task]
delete from sms.Expense
delete from [CRM].[FileResource]
truncate table [CRM].[LinkResource]
delete from [CRM].[Note]
delete from sms.ServiceOrderMaterialSerials
delete from [SMS].[ServiceOrderMaterial]
truncate table [SMS].[ServiceOrderTimePostings]
delete from [SMS].[ServiceOrderDispatch]
delete from sms.ServiceOrderChecklist
delete from  [SMS].[ServiceOrderTimes]
delete from [SMS].[ServiceOrderHead]
delete from CRM.ConfigurationRuleAffectedVariableValue
delete from CRM.ConfigurationRuleVariableValue
delete from CRM.ConfigurationRule
delete from sms.InstallationPos

truncate table [SMS].[ServiceNotifications]
truncate table [SMS].[MaintenancePlan]
truncate table [SMS].[ServiceContract]
truncate table [CRM].[OrderItem]
delete from [CRM].[Order]
truncate table [CRM].[BusinessRelationship]
truncate table [CRM].[ProjectContactRelationship]
truncate table [CRM].[Project]
truncate table [CRM].[Person]
delete from [CRM].[Company]
truncate table [SMS].[InstallationAddressRelationship]
delete from  [SMS].[InstallationHead]
truncate table [CRM].[Communication]
truncate table [SMS].[ServiceContractAddressRelationship]
truncate table [CRM].[Visit]
delete from [CRM].[Address]
truncate table [CRM].[ArticleRelationship]
truncate table [CRM].[Article]
truncate table [CRM].[Bravo]
truncate table [CRM].[ContactTags]
delete from [CRM].[DynamicFormReference]
truncate table [CRM].[DynamicFormResponse]
delete from   [CRM].[DynamicFormElement]
truncate table [CRM].[UserRecentPages]
truncate table [SMS].[ServiceObject]
truncate table [CRM].[CampaignContact]
truncate table crm.contactuserGroup

delete from sms.ServiceContractInstallationRelationship
delete from sms.ServiceContract
delete  from crm.ContactUser
delete  from sms.ReplenishmentOrderItem
delete from sms.MaintenancePlan
truncate table sms.serviceorderskill

truncate table sms.serviceordertype
truncate table sms.installationtype
delete from [CRM].[Contact]

delete  from [CRM].[Campaign]
-- Scheduler Part
delete from [RPL].[Dispatch]
truncate table [RPL].[DispatchTracking]
truncate table lu.country
delete from sms.CommissioningStatus
truncate table lu.manufacturer
-- User Part (you can delete everything and create a new user in the system or just leave one like default user, but you should edit the name then)
--WHERE Username <> 'default.1'

--select * from crm.[user] where [Adname] = 'ex_admin_lmobile'

delete from dbo.GrantedPermission
WHERE UserId <> select UserId from crm.[user] where [Adname] = 'ex_admin_lmobile'
delete from dbo.GrantedRole
WHERE UserId <> select UserId from crm.[user] where [Adname] = 'ex_admin_lmobile'
delete from dbo.PermissionSchemaRoleAssignment
WHERE UserId <> select UserId from crm.[user] where [Adname] = 'ex_admin_lmobile'
delete from [dbo].[GrantedEntityAccess]
WHERE UserId <> select UserId from crm.[user] where [Adname] = 'ex_admin_lmobile'

delete from [CRM].[UserUserGroup]
where Username <> select Username from crm.[user] where [Adname] = 'ex_admin_lmobile'

delete from dbo.[User]
WHERE Username <> select Username from crm.[user] where [Adname] = 'ex_admin_lmobile'


delete from [CRM].[User]
WHERE Username <> select Username from crm.[user] where [Adname] = 'ex_admin_lmobile'


-- Truncation (complete empty tables)
TRUNCATE TABLE [CRM].[Log]
TRUNCATE TABLE [CRM].[Posting]




