namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150413134700)]
	public class AddContactFkToCrmOrder : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				IF EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Order' AND COLUMN_NAME='BusinessPartnerContactKey' AND DATA_TYPE = 'int') AND EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Contact' AND COLUMN_NAME='ContactId' AND DATA_TYPE = 'uniqueidentifier')
				BEGIN
					EXEC sp_rename '[CRM].[Order].[BusinessPartnerContactKey]', 'BusinessPartnerContactKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[Order] ADD [BusinessPartnerContactKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[BusinessPartnerContactKey] = b.[ContactId] FROM [CRM].[Order] a JOIN [CRM].[Contact] b ON a.[BusinessPartnerContactKeyOld] = b.[ContactIdOld]')
					EXEC('DELETE FROM [CRM].[Order] WHERE [BusinessPartnerContactKey] IS NULL')
					ALTER TABLE [CRM].[Order] ALTER COLUMN [BusinessPartnerContactKey] uniqueidentifier NOT NULL
					ALTER TABLE [CRM].[Order] ALTER COLUMN [BusinessPartnerContactKeyOld] int NULL
				END
				");
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM sys.foreign_keys WHERE name = 'FK_Order_Contact'") == 0)
			{
				Database.ExecuteNonQuery("DELETE o FROM [CRM].[Order] o LEFT OUTER JOIN [CRM].[Contact] c ON o.[BusinessPartnerContactKey] = c.[ContactId] WHERE c.[ContactId] IS NULL");
				Database.AddForeignKey("FK_Order_Contact", "[CRM].[Order]", "BusinessPartnerContactKey", "[CRM].[Contact]", "ContactId", ForeignKeyConstraint.NoAction);
			}
		}
	}
}