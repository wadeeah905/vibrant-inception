namespace Crm.Order.Database
{
    using System.Data;

    using Crm.Library.Data.MigratorDotNet.Framework;
    using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

    [Migration(20160205115600)]
	public class AddIsExportedToCrmOrderItem : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[OrderItem]", new Column("IsExported", DbType.Boolean, ColumnProperty.NotNull, false));
		}
	}
}