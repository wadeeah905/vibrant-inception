namespace Crm.Order.Database.Migrate
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130507115655)]
	public class AddCurrencyColumn : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Order]", "CurrencyKey"))
			{
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [CurrencyKey] [nvarchar](40) NOT NULL DEFAULT 'Open'");
			}
		}
		public override void Down()
		{
		}
	}
}