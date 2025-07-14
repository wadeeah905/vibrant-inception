namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20131203143999)]
	public class AddIsSerialColumn : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[CRM].[OrderItem]", new Column("IsSerial", DbType.Boolean));
		}
		public override void Down()
		{
		}
	}
}