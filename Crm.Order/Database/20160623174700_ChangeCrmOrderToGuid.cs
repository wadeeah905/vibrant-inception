namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160623174700)]
	public class ChangeCrmOrderToGuid : Migration
	{
		public override void Up()
		{
			var orderIdIsGuid = (int)Database.ExecuteScalar(@"SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Order' AND COLUMN_NAME='OrderId' AND DATA_TYPE = 'uniqueidentifier'") == 1;
			if (orderIdIsGuid)
			{
				return;
			}
			Database.ExecuteNonQuery(@" IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'FK_CalculationPosition_Order')
					BEGIN
						ALTER TABLE [CRM].[CalculationPosition] DROP CONSTRAINT [FK_CalculationPosition_Order]
					END

			IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'FK_OrderItem_Order')
					BEGIN
						ALTER TABLE [CRM].[OrderItem] DROP CONSTRAINT [FK_OrderItem_Order]
					END

			IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'PK_OrderItem')
					BEGIN
						ALTER TABLE [CRM].[OrderItem] DROP CONSTRAINT [PK_OrderItem]
					END

			IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'FK_OrderItem_Order')
					BEGIN
						ALTER TABLE [CRM].[OrderUsergroup] DROP CONSTRAINT [FK_OrderUsergroup_Order]
					END

			IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'PK_OrderUsergroup')
					BEGIN
						ALTER TABLE [CRM].[OrderUsergroup] DROP CONSTRAINT [PK_OrderUsergroup]
					END

			IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'PK_OrderUser')
					BEGIN
						ALTER TABLE [CRM].[OrderUser] DROP CONSTRAINT [PK_OrderUser]
					END

			IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'FK_OrderUser_Order')
					BEGIN
						ALTER TABLE [CRM].[OrderUser] DROP CONSTRAINT [FK_OrderUser_Order]
					END

			IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'FK_OrderUsergroup_Order')
					BEGIN
						ALTER TABLE [CRM].[OrderUsergroup] DROP CONSTRAINT [FK_OrderUsergroup_Order]
					END

			IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'FK_OrderUserGroup_Usergroup')
					BEGIN
						ALTER TABLE [CRM].[OrderUsergroup] DROP CONSTRAINT [FK_OrderUserGroup_Usergroup]
					END

			IF EXISTS (SELECT * FROM sys.indexes WHERE NAME = 'IX_OrderItem_OrderKey_IsActive')
					BEGIN
						DROP INDEX[IX_OrderItem_OrderKey_IsActive] ON[CRM].[OrderItem]
					END

			IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'FK_Project_PreferredOfferId')
					BEGIN
						ALTER TABLE [CRM].[Project] DROP CONSTRAINT [FK_Project_PreferredOfferId]
					END

			IF EXISTS (SELECT * FROM sys.objects WHERE NAME = 'PK_Order')
					BEGIN
						ALTER TABLE [CRM].[Order] DROP CONSTRAINT [PK_Order]
					END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Order' AND COLUMN_NAME='OrderId' AND DATA_TYPE like '%int')
				BEGIN
					ALTER TABLE [CRM].[Order] ADD [OrderIdOld] bigint NULL
					EXEC('UPDATE [CRM].[Order] SET [OrderIdOld] = [OrderId]')
					ALTER TABLE [CRM].[Order] DROP COLUMN [OrderId]
					ALTER TABLE [CRM].[Order] ADD [OrderId] uniqueidentifier NOT NULL DEFAULT(NEWSEQUENTIALID())
					ALTER TABLE [CRM].[Order] ADD  CONSTRAINT [PK_Order] PRIMARY KEY CLUSTERED ([OrderId] ASC)
				END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='OrderUser' AND COLUMN_NAME='OrderKey' AND DATA_TYPE like '%int')
				BEGIN
					EXEC sp_rename '[CRM].[OrderUser].[OrderKey]', 'OrderKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[OrderUser] ADD [OrderKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[OrderKey] = b.[OrderId] FROM [CRM].[OrderUser] a LEFT OUTER JOIN [CRM].[Order] b ON a.[OrderKeyOld] = b.[OrderIdOld]')
					ALTER TABLE [CRM].[OrderUser] ALTER COLUMN [OrderKey] uniqueidentifier NOT NULL
					ALTER TABLE [CRM].[OrderUser] ALTER COLUMN [OrderKeyOld] bigint NULL
					ALTER TABLE [CRM].[OrderUser] ADD CONSTRAINT [PK_OrderUser] PRIMARY KEY CLUSTERED ([OrderKey] ASC,	[Username] ASC)
					ALTER TABLE [CRM].[OrderUser] ADD CONSTRAINT [FK_OrderUser_Order] FOREIGN KEY([OrderKey]) REFERENCES[CRM].[Order]([OrderId]) ON UPDATE CASCADE ON DELETE CASCADE
				END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='OrderUserGroup' AND COLUMN_NAME='OrderKey' AND DATA_TYPE like '%int')
				BEGIN
					EXEC sp_rename '[CRM].[OrderUserGroup].[OrderKey]', 'OrderKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[OrderUserGroup] ADD [OrderKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[OrderKey] = b.[OrderId] FROM [CRM].[OrderUserGroup] a LEFT OUTER JOIN [CRM].[Order] b ON a.[OrderKeyOld] = b.[OrderIdOld]')
					ALTER TABLE [CRM].[OrderUserGroup] ALTER COLUMN [OrderKey] uniqueidentifier NOT NULL
					ALTER TABLE [CRM].[OrderUserGroup] ALTER COLUMN [OrderKeyOld] bigint NULL
					ALTER TABLE [CRM].[OrderUsergroup] ADD CONSTRAINT [PK_OrderUsergroup] PRIMARY KEY CLUSTERED ([OrderKey] ASC,	[UsergroupKey] ASC)
					ALTER TABLE [CRM].[OrderUsergroup] ADD CONSTRAINT [FK_OrderUsergroup_Order] FOREIGN KEY([OrderKey]) REFERENCES [CRM].[Order]([OrderId]) ON UPDATE CASCADE ON DELETE CASCADE	
					ALTER TABLE [CRM].[OrderUsergroup] ADD CONSTRAINT [FK_OrderUserGroup_Usergroup] FOREIGN KEY([UsergroupKey]) REFERENCES [CRM].[Usergroup] ([UserGroupId]) ON UPDATE CASCADE ON DELETE CASCADE
				END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='OrderItem' AND COLUMN_NAME='OrderItemId' AND DATA_TYPE like '%int')
				BEGIN
					ALTER TABLE [CRM].[OrderItem] ADD [OrderItemIdOld] bigint NULL
					EXEC('UPDATE [CRM].[OrderItem] SET [OrderItemIdOld] = [OrderItemId]')
					ALTER TABLE [CRM].[OrderItem] DROP COLUMN [OrderItemId]
					ALTER TABLE [CRM].[OrderItem] ADD [OrderItemId] uniqueidentifier NOT NULL DEFAULT(NEWSEQUENTIALID())
					ALTER TABLE [CRM].[OrderItem] ADD CONSTRAINT [PK_OrderItem] PRIMARY KEY CLUSTERED ([OrderItemId] ASC)
				END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='OrderItem' AND COLUMN_NAME='OrderKey' AND DATA_TYPE like '%int')
				BEGIN
					EXEC sp_rename '[CRM].[OrderItem].[OrderKey]', 'OrderKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[OrderItem] ADD [OrderKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[OrderKey] = b.[OrderId] FROM [CRM].[OrderItem] a LEFT OUTER JOIN [CRM].[Order] b ON a.[OrderKeyOld] = b.[OrderIdOld]')
					ALTER TABLE [CRM].[OrderItem] ALTER COLUMN [OrderKeyOld] bigint NULL
					ALTER TABLE [CRM].[OrderItem] ADD CONSTRAINT [FK_OrderItem_Order] FOREIGN KEY([OrderKey]) REFERENCES[CRM].[Order]([OrderId])
				END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='CalculationPosition' AND COLUMN_NAME='OrderKey' AND DATA_TYPE like '%int')
				BEGIN
					EXEC sp_rename '[CRM].[CalculationPosition].[OrderKey]', 'OrderKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[CalculationPosition] ADD [OrderKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[OrderKey] = b.[OrderId] FROM [CRM].[CalculationPosition] a LEFT OUTER JOIN [CRM].[Order] b ON a.[OrderKeyOld] = b.[OrderIdOld]')
					ALTER TABLE [CRM].[CalculationPosition] ALTER COLUMN [OrderKeyOld] bigint NULL
					ALTER TABLE [CRM].[CalculationPosition] ALTER COLUMN [OrderKey] uniqueidentifier NOT NULL
					ALTER TABLE [CRM].[CalculationPosition] ADD CONSTRAINT [FK_CalculationPosition_Order] FOREIGN KEY ([OrderKey]) REFERENCES[CRM].[Order]([OrderId])
				END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='OrderItem' AND COLUMN_NAME='ParentOrderItemKey' AND DATA_TYPE like '%int')
				BEGIN
					EXEC sp_rename '[CRM].[OrderItem].[ParentOrderItemKey]', 'ParentOrderItemKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[OrderItem] ADD [ParentOrderItemKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[ParentOrderItemKey] = b.[OrderItemId] FROM [CRM].[OrderItem] a LEFT OUTER JOIN [CRM].[OrderItem] b ON a.[ParentOrderItemKeyOld] = b.[OrderItemIdOld]')					
					ALTER TABLE [CRM].[OrderItem] ADD CONSTRAINT [FK_OrderItem_ParentOrderItem] FOREIGN KEY([ParentOrderItemKey]) REFERENCES [CRM].[OrderItem] ([OrderItemId])
				END");

			Database.ExecuteNonQuery(@"CREATE NONCLUSTERED INDEX [IX_OrderItem_OrderKey_IsActive] ON [CRM].[OrderItem]
																(
																	[OrderKey] ASC,
																	[IsActive] ASC
																)
																INCLUDE(   [ArticleDescription],
																	[ArticleKey],
																	[ArticleNo],
																	[CreateDate],
																	[CreateUser],
																	[CustomDescription],
																	[DeliveryDate],
																	[Discount],
																	[DiscountType],
																	[IsCarDump],
																	[IsRemoval],
																	[IsSample],
																	[IsSerial],
																	[ModifyDate],
																	[ModifyUser],
																	[OrderItemId],
																	[Position],
																	[Price],
																	[QuantityUnitKey],
																	[QuantityValue],
																	[TenantKey])");
			
			Database.ExecuteNonQuery(@"IF EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Order' AND COLUMN_NAME='BusinessPartnerContactKey' AND DATA_TYPE = 'int')
				BEGIN
					EXEC sp_rename '[CRM].[Order].[BusinessPartnerContactKey]', 'BusinessPartnerContactKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[Order] ADD [BusinessPartnerContactKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[BusinessPartnerContactKey] = b.[ContactId] FROM [CRM].[Order] a Join [CRM].[Contact] b ON a.[BusinessPartnerContactKeyOld] = b.[ContactIdOld]')
					ALTER TABLE [CRM].[Order] ALTER COLUMN [BusinessPartnerContactKey] uniqueidentifier NOT NULL
					DELETE FROM [CRM].[Order] WHERE [BusinessPartnerContactKey] is null
					ALTER TABLE [CRM].[Order] ALTER COLUMN [BusinessPartnerContactKeyOld] int NULL
					ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_BusinessPartnerContact] FOREIGN KEY([BusinessPartnerContactKey]) REFERENCES [CRM].[Contact] ([ContactId])
				END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Order' AND COLUMN_NAME='ContactPerson' AND DATA_TYPE = 'int')
				BEGIN
					EXEC sp_rename '[CRM].[Order].[ContactPerson]', 'ContactPersonOld', 'COLUMN'
					ALTER TABLE [CRM].[Order] ADD [ContactPerson] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[ContactPerson] = b.[ContactId] FROM [CRM].[Order] a Join [CRM].[Contact] b ON a.[ContactPersonOld] = b.[ContactIdOld]')
					ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_ContactPerson] FOREIGN KEY([ContactPerson]) REFERENCES [CRM].[Contact] ([ContactId])
				END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Order' AND COLUMN_NAME='BusinessPartnerAddressKey' AND DATA_TYPE = 'int')
					BEGIN
						EXEC sp_rename '[CRM].[Order].[BusinessPartnerAddressKey]', 'BusinessPartnerAddressKeyOld', 'COLUMN'
						ALTER TABLE [CRM].[Order] ADD [BusinessPartnerAddressKey] uniqueidentifier NULL
						EXEC('UPDATE a SET a.[BusinessPartnerAddressKey] = b.[AddressId] FROM [Crm].[Order] a LEFT OUTER JOIN [CRM].[Address] b ON a.[BusinessPartnerAddressKeyOld] = b.[AddressIdOld]')
						ALTER TABLE [CRM].[Order] ALTER COLUMN [BusinessPartnerAddressKey] uniqueidentifier NOT NULL
						ALTER TABLE [CRM].[Order] ALTER COLUMN [BusinessPartnerAddressKeyOld] int NULL
						ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_BusinessPartnerAddress] FOREIGN KEY([BusinessPartnerAddressKey]) REFERENCES [CRM].[Address] ([AddressId])
					END");

			Database.ExecuteNonQuery(@"IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Project' AND COLUMN_NAME='PreferredOfferId' AND DATA_TYPE = 'uniqueidentifier')
					BEGIN
						ALTER TABLE [CRM].[Project] ADD CONSTRAINT [FK_Project_PreferredOfferId] FOREIGN KEY ([PreferredOfferId]) REFERENCES [CRM].[Order] ([OrderId])
					END");
		}
	}
}