namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20160808160100)]
	public class AddSignatureDateAndNameToCrmOrder : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("SignatureDate", DbType.DateTime, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("SignatureName", DbType.String, ColumnProperty.Null));
		}
	}
}