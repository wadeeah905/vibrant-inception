namespace Crm.Order.Database
{
	using System.Text;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130826134000)]
	public class AddOrderPermissions : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'CreateOrder') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('CreateOrder','Crm.Order') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditOrder') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('EditOrder','Crm.Order') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'DeleteOrder') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('DeletetOrder','Crm.Order') END");

			Database.ExecuteNonQuery(sb.ToString());
		}

		public override void Down()
		{

		}
	}
}