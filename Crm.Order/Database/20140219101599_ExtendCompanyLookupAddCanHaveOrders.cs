namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140219101599)]
	public class ExtendCompanyLookupAddCanHaveOrders : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[LU].[CompanyType]", new Column("CanHaveOrders", DbType.Boolean, ColumnProperty.NotNull, false));
		}
		public override void Down()
		{
		}
	}
}