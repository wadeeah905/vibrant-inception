namespace Crm.Order.Database
{
	using System.Text;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130816124000)]
	public class CheckPermissions : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditAllUsersOrders') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('EditAllUsersOrders','Crm.Order') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'SeeAllBaseOrders') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('SeeAllBaseOrders','Crm.Order') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'SeeAllUsersOrders') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('SeeAllUsersOrders','Crm.Order') END");

			Database.ExecuteNonQuery(sb.ToString());
		}

		public override void Down()
		{

		}
	}
}