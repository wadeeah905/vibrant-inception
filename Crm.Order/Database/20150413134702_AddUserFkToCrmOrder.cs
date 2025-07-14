namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150413134702)]
	public class AddUserFkToCrmOrder : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM sys.foreign_keys WHERE name = 'FK_Order_User'") == 0)
			{
				Database.ExecuteNonQuery("DELETE o FROM [CRM].[Order] o LEFT OUTER JOIN [CRM].[User] u ON o.[ResponsibleUser] = u.[Username] WHERE u.[Username] IS NULL");
				Database.AddForeignKey("FK_Order_User", "[CRM].[Order]", "ResponsibleUser", "[CRM].[User]", "Username", ForeignKeyConstraint.NoAction);
			}
		}
	}
}