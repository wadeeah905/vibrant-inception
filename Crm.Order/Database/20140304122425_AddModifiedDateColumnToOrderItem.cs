namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20141104122425)]
	public class AddModifiedDateColumnToOrderItem : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[OrderItem]", "ModifyDate"))
			{
				Database.AddColumn("[CRM].[OrderItem]", "ModifyDate", DbType.DateTime, ColumnProperty.None);
			}
		}
		public override void Down()
		{
			Database.RemoveColumn("[CRM].[OrderItem]", "ModifyDate");
		}
	}
}