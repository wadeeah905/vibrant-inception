namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20220113112800)]
	public class AddIsPercentageToCalculationPosition : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[CRM].[CalculationPosition]", "IsPercentage", System.Data.DbType.Boolean, 0, ColumnProperty.Null);
		}
	}
}
