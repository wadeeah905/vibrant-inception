namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20131017292875)]
	public class AddErpDeliveryProhibitedColumn : Migration
	{
		public override void Up()
		{
			// Because we need this information, regardless of the erp plugin. Mapped via a formula.
			if (!Database.ColumnExists("[CRM].[Company]", "ErpDeliveryProhibited"))
			{
				Database.AddColumn("[CRM].[Company]", "ErpDeliveryProhibited", DbType.Boolean, ColumnProperty.Null);
			}
		}
		public override void Down()
		{
		}
	}
}