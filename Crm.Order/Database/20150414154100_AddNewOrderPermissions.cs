namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150414154100)]
	public class AddNewOrderPermissions : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(
				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'SeeAllUsersOrders' AND PGroup = 'Order')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('SeeAllUsersOrders', 'Crm.Order', 1, 'Order') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'SeeAllUsersOffers' AND PGroup = 'Offer')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('SeeAllUsersOffers', 'Crm.Order', 1, 'Offer') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'Create' AND PGroup = 'Offer')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('Create', 'Crm.Order', 1, 'Offer') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'Create' AND PGroup = 'Order')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('Create', 'Crm.Order', 1, 'Order') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'Delete' AND PGroup = 'Offer')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('Delete', 'Crm.Order', 1, 'Offer') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'Delete' AND PGroup = 'Order')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('Delete', 'Crm.Order', 1, 'Order') END "
				);
		}
	}
}
