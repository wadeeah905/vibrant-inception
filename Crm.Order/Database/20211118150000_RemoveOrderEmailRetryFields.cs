namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20211118150000)]
	public class RemoveOrderEmailRetryFields : Migration
	{
		public override void Up()
		{
			Database.RemoveColumnIfEmpty("[CRM].[Order]", "ConfirmationSendingDetails", null);
			Database.ExecuteNonQuery("UPDATE [CRM].[Order] SET ConfirmationSent = 1 WHERE ConfirmationSendingRetries = 5");
			Database.RemoveColumnIfEmpty("[CRM].[Order]", "ConfirmationSendingRetries", 0);
		}
	}
}
