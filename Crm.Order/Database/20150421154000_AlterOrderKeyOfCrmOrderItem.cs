namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150421154000)]
	public class AlterOrderKeyOfCrmOrderItem : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'OrderItem' AND COLUMN_NAME = 'OrderKey' and DATA_TYPE = 'int'") == 1)
			{
				Database.ChangeColumn("[Crm].[OrderItem]", new Column("OrderKey", DbType.Int64, ColumnProperty.Null));
			}
		}
	}
}