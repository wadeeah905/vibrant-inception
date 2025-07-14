namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120101040000)]
	public class CreateVisitReport : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[VisitReport]"))
			{

				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("CREATE TABLE [CRM].[VisitReport](");
				stringBuilder.AppendLine("[VisitReportId] [int] IDENTITY(1,1) NOT NULL,");
				stringBuilder.AppendLine("[CompanyKey] [int] NOT NULL,");
				stringBuilder.AppendLine("[CompanyName] [nvarchar](120) NULL,");
				stringBuilder.AppendLine("[Street] [nvarchar](120) NULL,");
				stringBuilder.AppendLine("[ZipCode] [nvarchar](20) NULL,");
				stringBuilder.AppendLine("[City] [nvarchar](80) NULL,");
				stringBuilder.AppendLine("[ContactPerson] [nvarchar](4000) NULL,");
				stringBuilder.AppendLine("[ResponsibleUser] [nvarchar](256) NOT NULL,");
				stringBuilder.AppendLine("[VisitDate] [datetime] NOT NULL,");
				stringBuilder.AppendLine("[VisitAim] [nvarchar](256) NULL,");
				stringBuilder.AppendLine("[Status] [int] NOT NULL,");
				stringBuilder.AppendLine("[Version] [int] NOT NULL,	");
				stringBuilder.AppendLine("[CreateDate] [datetime] NOT NULL,");
				stringBuilder.AppendLine("[CreateUser] [nvarchar](250) NOT NULL,");
				stringBuilder.AppendLine("[ModifyDate] [datetime] NOT NULL,");
				stringBuilder.AppendLine("[ModifyUser] [nvarchar](250) NOT NULL");
				stringBuilder.AppendLine("CONSTRAINT [PK_VisitReport] PRIMARY KEY CLUSTERED ");
				stringBuilder.AppendLine("(");
				stringBuilder.AppendLine("[VisitReportId] ASC");
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
