namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20150211101100)]
	public class AddDocumentNoToCrmOrder : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("DocumentNo", DbType.String, 20, ColumnProperty.Null));
		}
	}
}