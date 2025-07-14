namespace Crm.Service.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230306150310)]
	public class AddClosedServiceOrderHistoryReplicationGroup : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(
				@"INSERT INTO [LU].[ReplicationGroup] ([Value], [Name], [Language], [DefaultValue], [Description], [HasParameter], [TableName])
				 VALUES ('ClosedServiceOrderHistory', 'Historie abgeschlossener Serviceaufträge', 'de', 90, 'Abgeschlossene Serviceaufträge der letzten x Tage. 0 um die gesamte Historie zu synchronisieren.', 1, 'CrmService_ServiceOrderHead')");
			Database.ExecuteNonQuery(
				@"INSERT INTO [LU].[ReplicationGroup] ([Value], [Name], [Language], [DefaultValue], [Description], [HasParameter], [TableName])
				 VALUES ('ClosedServiceOrderHistory', 'Closed service order history', 'en', 90, 'Closed service orders of the last x days. 0 to synchronize the whole history.', 1, 'CrmService_ServiceOrderHead')");
			Database.ExecuteNonQuery(
				@"INSERT INTO [LU].[ReplicationGroup] ([Value], [Name], [Language], [DefaultValue], [Description], [HasParameter], [TableName])
				 VALUES ('ClosedServiceOrderHistory', 'Historique des commandes de service fermés', 'fr', 90, 'Commandes de service fermés des x derniers jours. 0 pour synchroniser tout l''historique.', 1, 'CrmService_ServiceOrderHead')");
			Database.ExecuteNonQuery(
				@"INSERT INTO [LU].[ReplicationGroup] ([Value], [Name], [Language], [DefaultValue], [Description], [HasParameter], [TableName])
				 VALUES ('ClosedServiceOrderHistory', 'Historial de órdenes de servicio cerradas', 'es', 90, 'Órdenes de servicio cerradas de los últimos x días. 0 para sincronizar todo el historial.', 1, 'CrmService_ServiceOrderHead')");
			Database.ExecuteNonQuery(
				@"INSERT INTO [LU].[ReplicationGroup] ([Value], [Name], [Language], [DefaultValue], [Description], [HasParameter], [TableName])
				 VALUES ('ClosedServiceOrderHistory', 'Lezárt szervizrendelés előzményei', 'hu', 90, 'Lezárt szervizrendelések az elmúlt x napból. 0 az összes előzmény szinkronizálásához.', 1, 'CrmService_ServiceOrderHead')");
		}
	}
}
