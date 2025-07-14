namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140204174899)]
	public class MakeContactPersonAnInteger : Migration
	{
		public override void Up()
		{
			if (Database.ColumnExists("[CRM].[Order]", "ContactPerson") && !Database.ColumnExists("[CRM].[Order]", "ContactPersonBackup"))
			{
				Database.RenameColumn("[CRM].[Order]", "ContactPerson", "ContactPersonBackup");
				Database.AddColumn("[CRM].[Order]", new Column("ContactPerson", DbType.Int32));
			}
		}
		public override void Down()
		{
		}
	}
}