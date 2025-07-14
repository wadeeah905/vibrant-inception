namespace Crm.Order.Database.Migrate
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130425145355)]
	public class AddPrivateAndPublicDescriptions : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Order]", "PrivateDescription"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [PrivateDescription] NVARCHAR(500)");

			if (!Database.ColumnExists("[CRM].[Order]", "PublicDescription"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [PublicDescription] NVARCHAR(500)");
		}
		public override void Down()
		{
		}
	}
}