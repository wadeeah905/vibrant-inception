namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130927135790)]
	public class AddContactPerson : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Order]", "ContactPerson"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [ContactPerson] nvarchar(max)");
		}
		public override void Down()
		{
		}
	}
}