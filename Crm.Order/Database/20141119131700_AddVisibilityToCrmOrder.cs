namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20141119131700)]
	public class AddVisibilityToCrmOrder : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("Visibility", DbType.Int16, ColumnProperty.NotNull, 2));
		}
	}
}