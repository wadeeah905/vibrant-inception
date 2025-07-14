namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130626144600)]
	public class RecreateCrmVisit : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[Visit]"))
			{
				var addressDataType = (string)Database.ExecuteScalar("SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Address' AND COLUMN_NAME = 'AddressId'");
				var contactDataType = (string)Database.ExecuteScalar("SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Contact' AND COLUMN_NAME = 'ContactId'");
				var sb = new StringBuilder();

				sb.AppendLine("CREATE TABLE [CRM].[Visit](");
				sb.AppendLine($"[ContactKey] [{contactDataType}] NOT NULL,");
				sb.AppendLine($"[AddressKey] [{addressDataType}] NOT NULL,");
				sb.AppendLine("[Street] [nvarchar](120) NULL,");
				sb.AppendLine("[ZipCode] [nvarchar](20) NULL,");
				sb.AppendLine("[City] [nvarchar](80) NULL,");
				sb.AppendLine("[CountryKey] [nvarchar](20) NOT NULL,");
				sb.AppendLine($"[VisitReportKey] [{contactDataType}] NULL,");
				sb.AppendLine("[VisitReportStatus] [int] NULL,");
				sb.AppendLine("[ContactPerson] [nvarchar](4000) NULL,");
				sb.AppendLine("[Date] [date] NULL,");
				sb.AppendLine("[Time] [time](0) NULL,");
				sb.AppendLine("[Aim] [nvarchar](256) NULL,");
				sb.AppendLine("[VisitDuration] [time](0) NULL,");
				sb.AppendLine("[TenantKey] [int] NULL,");
				sb.AppendLine("CONSTRAINT [PK_Visit] PRIMARY KEY CLUSTERED ");
				sb.AppendLine("(");
				sb.AppendLine("[ContactKey] ASC");
				sb.AppendLine(")WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]");
				sb.AppendLine(") ON [PRIMARY]");

				sb.AppendLine("ALTER TABLE [CRM].[Visit]  WITH CHECK ADD  CONSTRAINT [FK_Visit_Contact] FOREIGN KEY([ContactKey])");
				sb.AppendLine("REFERENCES [CRM].[Contact] ([ContactId])");

				Database.ExecuteNonQuery(sb.ToString());
			}
		}
		public override void Down()
		{
		}
	}
}