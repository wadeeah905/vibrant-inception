namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130604103900)]
	public class RecreateCrmVisitReport : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[VisitReport]"))
			{
				var addressDataType = (string)Database.ExecuteScalar("SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Address' AND COLUMN_NAME = 'AddressId'");
				var contactDataType = (string)Database.ExecuteScalar("SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Contact' AND COLUMN_NAME = 'ContactId'");
				var sb = new StringBuilder();

				sb.AppendLine("CREATE TABLE [CRM].[VisitReport](");
				sb.AppendLine($"[ContactKey] [{contactDataType}] NOT NULL,");
				sb.AppendLine("[Street] [nvarchar](120) NULL,");
				sb.AppendLine("[ZipCode] [nvarchar](20) NULL,");
				sb.AppendLine("[City] [nvarchar](80) NULL,");
				sb.AppendLine("[ContactPerson] [nvarchar](4000) NULL,");
				sb.AppendLine("[VisitDate] [datetime] NOT NULL,");
				sb.AppendLine("[VisitAim] [nvarchar](256) NULL,");
				sb.AppendLine("[Status] [int] NOT NULL,");
				sb.AppendLine("[Version] [int] NOT NULL,");
				sb.AppendLine($"[AddressKey] [{addressDataType}] NOT NULL,");
				sb.AppendLine("CONSTRAINT [PK_VisitReport] PRIMARY KEY CLUSTERED ");
				sb.AppendLine("(");
				sb.AppendLine("[ContactKey] ASC");
				sb.AppendLine(")WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]");
				sb.AppendLine(") ON [PRIMARY]");

				sb.AppendLine("ALTER TABLE [CRM].[VisitReport]  WITH CHECK ADD  CONSTRAINT [FK_VisitReport_Contact] FOREIGN KEY([ContactKey])");
				sb.AppendLine("REFERENCES [CRM].[Contact] ([ContactId])");
				sb.AppendLine("ALTER TABLE [CRM].[VisitReport] ADD CONSTRAINT [FK_VisitReport_Address] FOREIGN KEY([AddressKey]) REFERENCES [CRM].[Address] ([AddressId])");

				Database.ExecuteNonQuery(sb.ToString());
			}
		}
		public override void Down()
		{
		}
	}
}