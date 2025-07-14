namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170331150000)]
	public class InsertValuesLuNoteType : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
INSERT INTO [LU].[NoteType]
           ([Name]
           ,[Language]
           ,[Value]
		   ,[Color]
		   ,[Icon]
           ,[Favorite]
           ,[SortOrder]
           ,[TenantKey]
           ,[CreateDate]
           ,[ModifyDate]
           ,[CreateUser]
           ,[ModifyUser]
           ,[IsActive])
     VALUES
 ('Neue Bestellung',			'de', 'BaseOrderCreatedNote',		'#4caf50', '\f19a', 0, 0, NULL, GETUTCDATE(), GETUTCDATE(), 'Migration_20170331150000', 'Migration_20170331150000', 1)
,('New Order',					'en', 'BaseOrderCreatedNote',		'#4caf50', '\f19a', 0, 0, NULL, GETUTCDATE(), GETUTCDATE(), 'Migration_20170331150000', 'Migration_20170331150000', 1)
,('Bestellungs-Statusänderung', 'de', 'BaseOrderStatusChangedNote', '#9164a6', '\f19a', 0, 0, NULL, GETUTCDATE(), GETUTCDATE(), 'Migration_20170331150000', 'Migration_20170331150000', 1)
,('Order Status changed',		'en', 'BaseOrderStatusChangedNote', '#9164a6', '\f19a', 0, 0, NULL, GETUTCDATE(), GETUTCDATE(), 'Migration_20170331150000', 'Migration_20170331150000', 1)
,('Auftrag-Statusänderung',		'de', 'OrderStatusChangedNote',		'#9164a6', '\f156', 0, 0, NULL, GETUTCDATE(), GETUTCDATE(), 'Migration_20170331150000', 'Migration_20170331150000', 1)
,('Order Status changed',		'en', 'OrderStatusChangedNote',		'#9164a6', '\f156', 0, 0, NULL, GETUTCDATE(), GETUTCDATE(), 'Migration_20170331150000', 'Migration_20170331150000', 1)
			");
		}
	}
}