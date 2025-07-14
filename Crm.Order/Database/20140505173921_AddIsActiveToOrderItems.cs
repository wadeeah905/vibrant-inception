namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140505173921)]
	public class AddIsActiveToOrderItems : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[CRM].[OrderItem]", "IsActive", DbType.Boolean, 1, ColumnProperty.NotNull, true);
		}
		public override void Down()
		{
		}
	}
}