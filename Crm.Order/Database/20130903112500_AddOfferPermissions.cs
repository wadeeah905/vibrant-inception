namespace Crm.Order.Database
{
	using System.Text;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130902112500)]
	public class AddOfferPermissions : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'CreateOffer') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('CreateOffer','Crm.Order') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditOffer') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('EditOffer','Crm.Order') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'DeleteOffer') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('DeleteOffer','Crm.Order') END");

			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'SeeAllUsersOffers') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('SeeAllUsersOffers','Crm.Order') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditAllUsersOffers') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('EditAllUsersOffers','Crm.Order') END");

			Database.ExecuteNonQuery(sb.ToString());
		}

		public override void Down()
		{

		}
	}
}