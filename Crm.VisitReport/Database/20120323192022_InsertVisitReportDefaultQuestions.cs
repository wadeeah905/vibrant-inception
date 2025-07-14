namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120323192022)]
	public class InsertVisitReportDefaultQuestions : Migration
	{
		public override void Up()
		{
			StringBuilder sb = new StringBuilder();

			sb.AppendLine("INSERT INTO Crm.VisitReportQuestion ([Version], [Position], [ControlType], [Text])");
			sb.AppendLine("VALUES");
			sb.AppendLine("(1,	1,	'TextArea',	'Zieldetails'),");
			sb.AppendLine("(1,	2,	'CheckBox',	'Ziel erreicht'),");
			sb.AppendLine("(1,	3,	'ListBox',	'Potential +'),");
			sb.AppendLine("(1,	4,	'ListBox',	'Potential keine Änderung'),");
			sb.AppendLine("(1,	5,	'ListBox',	'Potential -'),");
			sb.AppendLine("(1,	6,	'TextBox',	'Ergebnis'),");
			sb.AppendLine("(1,	7,	'ListBox',	'Aufgaben / Nachbearbeitung'),");
			sb.AppendLine("(1,	8,	'TextArea',	'Aufgabendetails')");

			Database.ExecuteNonQuery(sb.ToString());
		}
		public override void Down()
		{
			
		}
	}
}
