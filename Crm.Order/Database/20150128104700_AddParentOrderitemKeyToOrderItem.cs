namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20150128104700)]
	public class AddParentOrderItemKeyToOrderItem : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[OrderItem]", new Column("ParentOrderItemKey", DbType.Int64, ColumnProperty.Null));
		}
	}
}