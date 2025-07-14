namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160802133901)]
	public class AddDefaultOrderEntryTypes : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("INSERT INTO [LU].[OrderEntryType] ([Value], [Name], [Language], [CreateUser], [ModifyUser]) VALUES ('SingleDelivery', 'Einzellieferung', 'de', 'Setup', 'Setup')");
			Database.ExecuteNonQuery("INSERT INTO [LU].[OrderEntryType] ([Value], [Name], [Language], [CreateUser], [ModifyUser]) VALUES ('SingleDelivery', 'Single delivery', 'en', 'Setup', 'Setup')");
			Database.ExecuteNonQuery("INSERT INTO [LU].[OrderEntryType] ([Value], [Name], [Language], [CreateUser], [ModifyUser]) VALUES ('MultiDelivery', 'Mehrfachlieferung', 'de', 'Setup', 'Setup')");
			Database.ExecuteNonQuery("INSERT INTO [LU].[OrderEntryType] ([Value], [Name], [Language], [CreateUser], [ModifyUser]) VALUES ('MultiDelivery', 'Multiple deliveries', 'en', 'Setup', 'Setup')");
		}
	}
}