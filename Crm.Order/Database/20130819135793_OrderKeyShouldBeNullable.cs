namespace Crm.Order.Database.Migrate
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

    [Migration(20130819135793)]
	public class OrderKeyShouldBeNullable : Migration
	{
		public override void Up()
		{
            var orderKeyColumn = new Column("OrderKey", DbType.Int32, ColumnProperty.Null);
			Database.ChangeColumn("[Crm].[OrderItem]", orderKeyColumn);
		}
		public override void Down()
		{
            var orderKeyColumn = new Column("OrderKey", DbType.Int32, ColumnProperty.NotNull);
            Database.ChangeColumn("[Crm].[OrderItem]", orderKeyColumn);
		}
	}
}