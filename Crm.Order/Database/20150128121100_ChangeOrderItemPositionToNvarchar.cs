namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150128121100)]
	public class ChangeOrderItemPositionToNvarchar : Migration
	{
		public override void Up()
		{
			Database.ChangeColumn("[CRM].[OrderItem]", new Column("Position", DbType.String, 10, ColumnProperty.Null));
		}
	}
}