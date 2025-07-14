namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160920170100)]
	public class AddOrderNoToCrmOrder : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Order]", "OrderNo"))
			{
				Database.AddColumn("[CRM].[Order]", new Column("OrderNo", DbType.String));
				Database.ExecuteNonQuery("UPDATE [CRM].[Order] SET [OrderNo] = CONVERT(nvarchar, [OrderIdOld])");
			}
		}
	}
}