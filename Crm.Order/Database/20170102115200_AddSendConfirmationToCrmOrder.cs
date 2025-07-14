namespace Crm.Order.Database
{
	using System;
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170102115200)]
	public class AddSendConfirmationToCrmOrder : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("SendConfirmation", DbType.Boolean, ColumnProperty.NotNull, false));
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("ConfirmationSendingDetails", DbType.String, Int32.MaxValue, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("ConfirmationSendingRetries", DbType.Int32, ColumnProperty.NotNull, 0));
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("ConfirmationSent", DbType.Boolean, ColumnProperty.NotNull, false));
		}
	}
}