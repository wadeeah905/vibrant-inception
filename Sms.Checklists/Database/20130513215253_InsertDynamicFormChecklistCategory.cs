namespace Sms.Checklists.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130513215253)]
	public class InsertDynamicFormChecklistCategory : Migration
	{
		public override void Up()
		{
			var query = new StringBuilder();

			query.AppendLine("INSERT INTO LU.DynamicFormCategory (Name, Language, Value) VALUES ('Checkliste', 'de', 'Checklist')");
			query.AppendLine("INSERT INTO LU.DynamicFormCategory (Name, Language, Value) VALUES ('Checklist', 'en', 'Checklist')");

			Database.ExecuteNonQuery(query.ToString());
		}
		public override void Down()
		{
			
		}
	}
}
