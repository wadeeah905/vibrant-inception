namespace Crm.Order.Database.Migrate
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130430133945)]
	public class DropStatusColumnAddStatusKey : Migration
	{
		public override void Up()
		{
			if (Database.ColumnExists("[CRM].[Order]", "Status") && !Database.ColumnExists("[CRM].[Order]", "StatusKey"))
			{
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [StatusKey] [nvarchar](40) NOT NULL DEFAULT 'Open'");
				Database.ExecuteNonQuery("ALTER TABLE [Crm].[Order] DROP COLUMN [Status]");
			}
		}
		public override void Down()
		{
		}
	}
}