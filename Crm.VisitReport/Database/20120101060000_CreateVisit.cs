namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120101060000)]
	public class CreateVisit : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[Visit]"))
			{

				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("CREATE TABLE [CRM].[Visit](");
				stringBuilder.AppendLine("[VisitId] [int] IDENTITY(1,1) NOT NULL,");
				stringBuilder.AppendLine("[CompanyKey] [int] NOT NULL,");
				stringBuilder.AppendLine("[CompanyName] [nvarchar](250) NOT NULL,");
				stringBuilder.AppendLine("[AddressKey] [int] NOT NULL,");
				stringBuilder.AppendLine("[Street] [nvarchar](250) NULL,");
				stringBuilder.AppendLine("[ZipCode] [nvarchar](250) NULL,");
				stringBuilder.AppendLine("[City] [nvarchar](250) NULL,");
				stringBuilder.AppendLine("[CountryKey] [nvarchar](20) NOT NULL,");
				stringBuilder.AppendLine("[VisitReportKey] [int] NULL,");
				stringBuilder.AppendLine("[VisitReportStatus] [int] NULL,");
				stringBuilder.AppendLine("[ContactPerson] [nvarchar](250) NULL,");
				stringBuilder.AppendLine("[Date] [date] NOT NULL,");
				stringBuilder.AppendLine("[Time] [time](0) NULL,");
				stringBuilder.AppendLine("[Aim] [nvarchar](4000) NULL,");
				stringBuilder.AppendLine("[ResponsibleUser] [nvarchar](250) NOT NULL,");
				stringBuilder.AppendLine("[CreateDate] [datetime] NOT NULL,");
				stringBuilder.AppendLine("[CreateUser] [nvarchar](250) NOT NULL,");
				stringBuilder.AppendLine("[ModifyDate] [datetime] NOT NULL,");
				stringBuilder.AppendLine("[ModifyUser] [nvarchar](250) NOT NULL");
				stringBuilder.AppendLine("CONSTRAINT [PK_Visit] PRIMARY KEY CLUSTERED ");
				stringBuilder.AppendLine("(");
				stringBuilder.AppendLine("[VisitId] ASC");
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
