namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;
	using Crm.Library.Extensions;

	[Migration(20170724120003)]
	public class AddDefaultValuesToLookups : Migration
	{
		public override void Up()
		{
			new[]
			{
				new { Schema = "LU", Table = "CalculationPositionType" },
				new { Schema = "LU", Table = "OrderCategory" },
				new { Schema = "LU", Table = "OrderEntryType" },
				new { Schema = "LU", Table = "OrderStatus" }
			}
			.ForEach(x => Database.AddEntityBaseDefaultContraints(x.Schema, x.Table));
		}
	}
}