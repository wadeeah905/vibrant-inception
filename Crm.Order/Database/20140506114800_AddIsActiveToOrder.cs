namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140506114800)]
	public class AddIsActiveToOrder : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[CRM].[Order]", "IsActive", DbType.Boolean, 1, ColumnProperty.NotNull, true);
		}
		public override void Down()
		{
		}
	}
}