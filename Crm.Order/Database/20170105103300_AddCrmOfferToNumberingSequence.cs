namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170105103300)]
	public class AddCrmOfferToNumberingSequence : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM [dbo].[NumberingSequence] WHERE SequenceName = 'CRM.Offer'") == 0 && (int)Database.ExecuteScalar("SELECT COUNT(*) FROM [CRM].[Order] WHERE [OrderType] = 'Offer'") == 0)
			{
				Database.ExecuteNonQuery(@"INSERT INTO [dbo].[NumberingSequence] ([SequenceName], [LastNumber], [Prefix], [Format], [Suffix], [MaxLow])	
										VALUES(
											'CRM.Offer', 
											0,
											'OF', 
											'000000',
											NULL, 
											32)");
			}
		}
	}
}