namespace Crm.Order.Database
{
	using System.Data;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20220110150100)]
	public class AddConfirmationSendingErrorToOrder : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("ConfirmationSendingError", DbType.String, int.MaxValue, ColumnProperty.Null));
		}
	}
}