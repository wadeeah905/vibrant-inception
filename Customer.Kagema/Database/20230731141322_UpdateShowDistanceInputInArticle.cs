namespace Customer.Kagema.Database
{

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230731141322)]

	public class UpdateShowDistanceInputInArticle : Migration
	{
		public override void Up()
		{
			// updates the prefixes of the AdHoc and Serviceorders and also updates the amount of 0 of AdHoc orders from 6 to 5
			Database.ExecuteNonQuery("Update [CRM].[Article] Set ShowDistanceInput = 1 where ItemNo='ANFAHRT'");
		}
	}
}
