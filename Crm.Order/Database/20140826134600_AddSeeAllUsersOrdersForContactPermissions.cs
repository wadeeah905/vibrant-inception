namespace Crm.Order.Database
{
	using System.Text;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140826134600)]
	public class AddSeeAllUsersOrdersForContactPermissions : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'SeeAllUsersOrdersForContact') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('SeeAllUsersOrdersForContact','Crm.Order') END");

			Database.ExecuteNonQuery(sb.ToString());
		}

		public override void Down()
		{

		}
	}
}