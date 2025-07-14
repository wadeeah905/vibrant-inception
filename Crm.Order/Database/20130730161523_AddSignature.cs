namespace Crm.Order.Database.Migrate
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130730161523)]
	public class AddSignature : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Order]", "Signature"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [Signature] nvarchar(max)");
		}
		public override void Down()
		{
		}
	}
}