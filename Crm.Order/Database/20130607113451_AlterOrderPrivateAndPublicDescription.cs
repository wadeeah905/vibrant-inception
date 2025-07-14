namespace Crm.Order.Database.Migrate
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130607113451)]
	public class AlterOrderPrivateAndPublicDescription : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ALTER COLUMN [PrivateDescription] NVARCHAR(1020)");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ALTER COLUMN [PublicDescription] NVARCHAR(1020)");
		}
		public override void Down()
		{
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ALTER COLUMN [PrivateDescription] NVARCHAR(500)");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ALTER COLUMN [PublicDescription] NVARCHAR(500)");
		}
	}
}