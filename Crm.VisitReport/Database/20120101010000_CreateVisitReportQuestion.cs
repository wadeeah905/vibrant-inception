namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120101010000)]
	public class CreateVisitReportQuestion : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[VisitReportQuestion]"))
			{

				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("CREATE TABLE [CRM].[VisitReportQuestion](");
				stringBuilder.AppendLine("[Version] [int] NOT NULL,");
				stringBuilder.AppendLine("[Position] [int] NOT NULL,");
				stringBuilder.AppendLine("[ControlType] [nvarchar](100) NOT NULL,");
				stringBuilder.AppendLine("[Text] [nvarchar](4000) NOT NULL,");
				stringBuilder.AppendLine("CONSTRAINT [PK_VisitReportQuestion] PRIMARY KEY CLUSTERED ");
				stringBuilder.AppendLine("(");
				stringBuilder.AppendLine("[Version] ASC,");
				stringBuilder.AppendLine("[Position] ASC");
				stringBuilder.AppendLine(")WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]");
				stringBuilder.AppendLine(") ON [PRIMARY]");

				Database.ExecuteNonQuery(stringBuilder.ToString());
			}
		}
		public override void Down()
		{

		}
	}
}
