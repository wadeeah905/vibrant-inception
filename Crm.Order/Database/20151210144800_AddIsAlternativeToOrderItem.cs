namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20151210144800)]
	public class AddIsAlternativeToOrderItem : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[OrderItem]", new Column("IsAlternative", DbType.Boolean, ColumnProperty.NotNull, false));
		}
	}
}