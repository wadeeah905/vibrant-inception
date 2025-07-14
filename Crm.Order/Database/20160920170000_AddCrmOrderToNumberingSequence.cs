namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160920170000)]
	public class AddCrmOrderToNumberingSequence : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM [dbo].[NumberingSequence] WHERE SequenceName = 'CRM.Order'") == 0)
			{
				Database.ExecuteNonQuery(@"INSERT INTO [dbo].[NumberingSequence] ([SequenceName], [LastNumber], [Prefix], [Format], [Suffix], [MaxLow])	
										VALUES(
											'CRM.Order', 
											(SELECT [next_hi] FROM [dbo].[hibernate_unique_key_old] WHERE [tablename] = '[CRM].[Order]'),
											'OC', 
											'000000',
											NULL, 
											32)");
			}
		}
	}
}