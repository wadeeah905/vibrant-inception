namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130513215253)]
	public class InsertDynamicFormChecklistCategory : Migration
	{
		public override void Up()
		{
			var query = new StringBuilder();

			query.AppendLine("INSERT INTO LU.DynamicFormCategory (Name, Language, Value) VALUES ('Besuchsbericht', 'de', 'VisitReport')");
			query.AppendLine("INSERT INTO LU.DynamicFormCategory (Name, Language, Value) VALUES ('Visit report', 'en', 'VisitReport')");

			Database.ExecuteNonQuery(query.ToString());
		}
	}
}
