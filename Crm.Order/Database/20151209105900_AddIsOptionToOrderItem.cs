namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20151209105900)]
	public class AddIsOptionToOrderItem : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[OrderItem]", new Column("IsOption", DbType.Boolean, ColumnProperty.NotNull, false));
		}
	}
}