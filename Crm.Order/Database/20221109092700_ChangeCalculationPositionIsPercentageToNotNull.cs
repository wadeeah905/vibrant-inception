namespace Crm.Order.Database
{
	using System.Data;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20221109092700)]
	public class ChangeCalculationPositionIsPercentageToNotNull : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("UPDATE [CRM].[CalculationPosition] SET IsPercentage = 0 WHERE IsPercentage IS NULL");
			Database.ChangeColumn("[CRM].[CalculationPosition]", new Column("IsPercentage", DbType.Boolean, ColumnProperty.NotNull));
		}
	}
}
