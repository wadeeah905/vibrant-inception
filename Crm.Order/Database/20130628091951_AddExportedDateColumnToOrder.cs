namespace Crm.Order.Database.Migrate
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130628091951)]
	public class AddExportedDateColumnToOrder : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[CRM].[Order]", "ExportDate", DbType.DateTime, ColumnProperty.None);
		}
		public override void Down()
		{
			Database.RemoveColumn("[CRM].[Order]", "ExportDate");
		}
	}
}