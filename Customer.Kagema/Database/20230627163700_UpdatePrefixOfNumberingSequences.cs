namespace Customer.Kagema.Database
{

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230627163700)]

	public class UpdatePrefixOfNumberingSequences : Migration
	{
		public override void Up()
		{
			// updates the prefixes of the AdHoc and Serviceorders and also updates the amount of 0 of AdHoc orders from 6 to 5
			Database.ExecuteNonQuery("Update [dbo].[NumberingSequence] Set Prefix = 'SAA', Format = '00000' where SequenceName = 'SMS.ServiceOrderHead.AdHoc'");
			Database.ExecuteNonQuery("Update [dbo].[NumberingSequence] Set Prefix = 'SAL' where SequenceName = 'SMS.ServiceOrderHead.ServiceOrder'  ");
		}
	}
}
