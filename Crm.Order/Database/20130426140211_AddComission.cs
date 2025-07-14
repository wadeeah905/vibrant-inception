namespace Crm.Order.Database.Migrate
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130426140211)]
	public class AddComission : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Order]", "Comission"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [Comission] [nvarchar](256)");
		}
		public override void Down()
		{
		}
	}
}