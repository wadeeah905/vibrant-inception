namespace Crm.Order.Database.Migrate
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130702171699)]
	public class SeeAllBaseOrdersPermission : Migration
	{
		public override void Up()
		{
			var query = new StringBuilder();
			query.AppendLine("INSERT INTO [CRM].[Permission] (Name, PluginName) VALUES ('SeeAllBaseOrders', 'Crm.Order')");
			Database.ExecuteNonQuery(query.ToString());
		}
		public override void Down()
		{
			var query = new StringBuilder();
			query.AppendLine("DELETE FROM [CRM].[Permission] WHERE [Name] = 'SeeAllBaseOrders'");
			Database.ExecuteNonQuery(query.ToString());
		}
	}
}