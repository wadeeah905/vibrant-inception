namespace Crm.Order.Database.Migrate
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130425154955)]
	public class AddRepresentative : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Order]", "Representative"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [Representative] [nvarchar](256)");
		}
		public override void Down()
		{
		}
	}
}