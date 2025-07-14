namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20161230112501)]
	public class AddColorLuOrderStatus : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("LU.OrderStatus", new Column("Color", DbType.String, 20, ColumnProperty.NotNull, "'#9E9E9E'"));
			Database.ExecuteNonQuery("UPDATE [LU].[OrderStatus] SET Color = '#4CAF50' WHERE [Value] = 'Open'");
			Database.ExecuteNonQuery("UPDATE [LU].[OrderStatus] SET Color = '#F44336' WHERE [Value] = 'Closed'");
		}
	}
}