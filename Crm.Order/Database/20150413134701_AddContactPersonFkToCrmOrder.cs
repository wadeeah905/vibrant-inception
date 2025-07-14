namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150413134701)]
	public class AddContactPersonFkToCrmOrder : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				IF EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Order' AND COLUMN_NAME='ContactPerson' AND DATA_TYPE = 'int') AND EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Contact' AND COLUMN_NAME='ContactId' AND DATA_TYPE = 'uniqueidentifier')
				BEGIN
					EXEC sp_rename '[CRM].[Order].[ContactPerson]', 'ContactPersonOld', 'COLUMN'
					ALTER TABLE [CRM].[Order] ADD [ContactPerson] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[ContactPerson] = b.[ContactId] FROM [CRM].[Order] a JOIN [CRM].[Contact] b ON a.[ContactPersonOld] = b.[ContactIdOld]')
				END
				");
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM sys.foreign_keys WHERE name = 'FK_Order_Person'") == 0)
			{
				Database.ExecuteNonQuery("UPDATE o SET o.[ContactPerson] = NULL FROM [CRM].[Order] o LEFT OUTER JOIN [CRM].[Person] p ON o.[ContactPerson] = p.[ContactKey] WHERE p.[ContactKey] IS NULL");
				Database.AddForeignKey("FK_Order_Person", "[CRM].[Order]", "ContactPerson", "[CRM].[Person]", "ContactKey", ForeignKeyConstraint.SetNull);
			}
		}
	}
}