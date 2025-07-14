namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140205164399)]
	public class AddCustomEmailAndFax : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[CRM].[Order]", new Column("CustomEmail", DbType.String));
			Database.AddColumn("[CRM].[Order]", new Column("CustomFax", DbType.String));
		}
		public override void Down()
		{
		}
	}
}