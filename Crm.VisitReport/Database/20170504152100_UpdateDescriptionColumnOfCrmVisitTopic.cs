namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170504152100)]
	public class UpdateDescriptionColumnOfCrmVisitTopic : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				UPDATE vt
				SET vt.Description = n.Text
				FROM CRM.VisitTopic vt
				JOIN CRM.Note n
					ON n.ElementKey = vt.VisitKey
					AND n.Subject = vt.Topic
				WHERE vt.Description IS NULL
			");
		}
	}
}