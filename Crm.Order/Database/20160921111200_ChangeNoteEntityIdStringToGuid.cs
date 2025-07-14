namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160921111200)]
	public class ChangeNoteEntityIdStringToGuid : Migration
	{
		public override void Up()
		{
			if (Database.ColumnExists("[CRM].[Note]", "EntityId"))
			{
				Database.ExecuteNonQuery(@"
					BEGIN
						EXEC sp_rename '[CRM].[Note].[EntityId]', 'EntityIdOld', 'COLUMN'
						ALTER TABLE [CRM].[Note] ADD [EntityId] uniqueidentifier NULL
						EXEC('UPDATE a SET a.[EntityId] = b.[OrderId] FROM [Crm].[Note] a LEFT OUTER JOIN [CRM].[Order] b ON a.[EntityIdOld] = b.[OrderIdOld]')
					END");
			}
		}
	}
}
