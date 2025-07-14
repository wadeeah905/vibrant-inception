namespace Customer.Kagema.Database
{

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20240426083700)]

	public class UpdateLastNumberOfNumberingSequences : Migration
	{
		public override void Up()
		{
			// updates the LastNumber of the AdHoc 
			Database.ExecuteNonQuery("Update [dbo].[NumberingSequence] Set LastNumber = 0 where SequenceName = 'SMS.ServiceOrderHead.AdHoc'");
		}
	}
}
