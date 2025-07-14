namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20160715095000)]
	public class AddPositiveNegativeQuantityFlagsToOrderCategory : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[LU].[OrderCategory]", new Column("AllowNegativeQuantities", DbType.Boolean, ColumnProperty.NotNull, false));
			Database.AddColumnIfNotExisting("[LU].[OrderCategory]", new Column("AllowPositiveQuantities", DbType.Boolean, ColumnProperty.NotNull, true));
		}
	}
}