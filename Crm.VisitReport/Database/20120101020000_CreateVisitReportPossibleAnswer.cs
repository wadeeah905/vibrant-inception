namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120101020000)]
	public class CreateVisitReportPossibleAnswer : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[VisitReportPossibleAnswer]"))
			{

				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("CREATE TABLE [CRM].[VisitReportPossibleAnswer](");
				stringBuilder.AppendLine("[Version] [int] NOT NULL,");
				stringBuilder.AppendLine("[PositionQuestion] [int] NOT NULL,");
				stringBuilder.AppendLine("[PositionAnswer] [int] NOT NULL,");
				stringBuilder.AppendLine("[Text] [text] NOT NULL,");
				stringBuilder.AppendLine("CONSTRAINT [PK_VisitReportPossibleAnswer] PRIMARY KEY CLUSTERED ");
				stringBuilder.AppendLine("(");
				stringBuilder.AppendLine("[Version] ASC,");
				stringBuilder.AppendLine("[PositionQuestion] ASC,");
				stringBuilder.AppendLine("[PositionAnswer] ASC");
				stringBuilder.AppendLine(")WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]");
				stringBuilder.AppendLine(") ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]");

				Database.ExecuteNonQuery(stringBuilder.ToString());
			}
		}
		public override void Down()
		{

		}
	}
}
