namespace Crm.Order.Database
{
    using System.Data;

    using Crm.Library.Data.MigratorDotNet.Framework;
    using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

    [Migration(20160624120002)]
	public class AddIsExportedToCrmCalculationPosition : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[CalculationPosition]", new Column("IsExported", DbType.Boolean, ColumnProperty.NotNull, false));
		}
	}
}