namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20211217105000)]
	public class AddCountryKeyToVATLevel : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[LU].[VATLevel]", "CountryKey", System.Data.DbType.String, ColumnProperty.Null);
		}
	}
}
