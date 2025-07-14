namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240318080000)]
	public class AddExtensionsToCrmArticle : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.Article", new Column("VendorNo", DbType.String, 20, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("CRM.Article", new Column("ShelfNo", DbType.String, 10, ColumnProperty.Null));
		}
	}
}
