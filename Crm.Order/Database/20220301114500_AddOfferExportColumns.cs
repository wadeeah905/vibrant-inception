namespace Crm.Order.Database
{
	using System.Data;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20220301114500)]
	public class AddOfferExportColumns : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("IsLocked", DbType.Boolean, ColumnProperty.NotNull, false));
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("ReadyForExport", DbType.Boolean, ColumnProperty.NotNull, false));
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("CancelReasonText", DbType.String, ColumnProperty.Null, false));
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("CancelReasonCategoryKey", DbType.String, 20, ColumnProperty.Null, false));
			Database.ExecuteNonQuery("Update [Crm].[Order] SET IsLocked = 1 WHERE SendConfirmation = 1 AND OrderType = 'Offer'");
			
			Database.AddLookupTable("OrderCancelReasonCategory");
			Database.AddColumnIfNotExisting("[LU].[OrderCancelReasonCategory]", new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true));
			Database.AddColumnIfNotExisting("[LU].[OrderCancelReasonCategory]", new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"));
			Database.AddColumnIfNotExisting("[LU].[OrderCancelReasonCategory]", new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"));
			Database.AddColumnIfNotExisting("[LU].[OrderCancelReasonCategory]", new Column("ModifyUser", DbType.String, ColumnProperty.NotNull, "'Setup'"));
			Database.AddColumnIfNotExisting("[LU].[OrderCancelReasonCategory]", new Column("CreateUser", DbType.String, ColumnProperty.NotNull, "'Setup'"));

			Database.InsertLookupWithColorValue("OrderStatus", "Canceled", "Abgebrochen","#ffe312", "de");
			Database.InsertLookupWithColorValue("OrderStatus", "Canceled", "Canceled","#ffe312","en");
			Database.InsertLookupWithColorValue("OrderStatus", "Canceled", "Annulé","#ffe312","fr");
			Database.InsertLookupWithColorValue("OrderStatus", "Canceled", "Törölve","#ffe312","hu");
			Database.InsertLookupWithColorValue("OrderStatus", "Canceled", "Cancelado","#ffe312","es");
			
			Database.InsertLookupWithColorValue("OrderStatus", "Expired", "Abgelaufen","#ff9d00", "de");
			Database.InsertLookupWithColorValue("OrderStatus", "Expired", "Expired","#ff9d00", "en");
			Database.InsertLookupWithColorValue("OrderStatus", "Expired", "Expiré","#ff9d00", "fr");
			Database.InsertLookupWithColorValue("OrderStatus", "Expired", "Lejárt","#ff9d00", "hu");
			Database.InsertLookupWithColorValue("OrderStatus", "Expired", "Caducado","#ff9d00", "es");
			
			Database.InsertLookupWithColorValue("OrderStatus", "OrderCreated", "Auftrag erstellt","#00ffff", "de");
			Database.InsertLookupWithColorValue("OrderStatus", "OrderCreated", "Order created","#00ffff", "en");
			Database.InsertLookupWithColorValue("OrderStatus", "OrderCreated", "Commande créée","#00ffff", "fr");
			Database.InsertLookupWithColorValue("OrderStatus", "OrderCreated", "Pedido creado","#00ffff", "es");
			
		}
	}
}