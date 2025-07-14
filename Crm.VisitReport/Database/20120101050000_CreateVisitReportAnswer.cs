namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120101050000)]
	public class CreateVisitReportAnswer : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[VisitReportAnswer]"))
			{

				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("CREATE TABLE [CRM].[VisitReportAnswer](");
				stringBuilder.AppendLine("[VisitReportAnswerId] [int] IDENTITY(1,1) NOT NULL,");
				stringBuilder.AppendLine("[VisitReportKey] [int] NOT NULL,");
				stringBuilder.AppendLine("[PositionQuestion] [int] NOT NULL,");
				stringBuilder.AppendLine("[Text] [text] NOT NULL,");
				stringBuilder.AppendLine("CONSTRAINT [PK_VisitReportAnswer] PRIMARY KEY CLUSTERED ");
				stringBuilder.AppendLine("(");
				stringBuilder.AppendLine("[VisitReportAnswerId] ASC");
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
