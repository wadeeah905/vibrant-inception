namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150201131000)]
	public class CorrectPermissionGroupsForCrmOrder : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("UPDATE [CRM].[Permission] SET [PGroup] = 'Order' WHERE [PGroup] = 'ServiceOrder' AND [PluginName] = 'Crm.Order' AND [Name] LIKE '%Order%'");
			Database.ExecuteNonQuery("UPDATE [CRM].[Permission] SET [PGroup] = 'Offer' WHERE [PGroup] = 'ServiceOrder' AND [PluginName] = 'Crm.Order' AND [Name] LIKE '%Offer%'");
		}
	}
}