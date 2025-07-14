namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130812082400)]
	public class AddTableVisitTopic : Migration
	{
		public override void Up()
		{
			var visitDataType = (string)Database.ExecuteScalar("SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Visit' AND COLUMN_NAME = 'ContactKey'");
			var sb = new StringBuilder();

			sb.AppendLine("CREATE TABLE [CRM].[VisitTopic](");
			sb.AppendLine("[VisitTopicId] [int] IDENTITY(1,1) NOT NULL,");
			sb.AppendLine($"[VisitKey] [{visitDataType}] NOT NULL,");
			sb.AppendLine("[Position] [int] NOT NULL,");
			sb.AppendLine("[Text] [nvarchar](4000) NOT NULL,");
			sb.AppendLine("[IsActive] [bit] NOT NULL,");
			sb.AppendLine("[CreateDate] [datetime] NOT NULL,");
			sb.AppendLine("[ModifyDate] [datetime] NOT NULL,");
			sb.AppendLine("[CreateUser] [nvarchar](60) NOT NULL,");
			sb.AppendLine("[ModifyUser] [nvarchar](60) NOT NULL,");
			sb.AppendLine("[TenantKey] [int] NULL,");
			sb.AppendLine("CONSTRAINT [PK_VisitTopic] PRIMARY KEY CLUSTERED ");
			sb.AppendLine("(");
			sb.AppendLine("[VisitTopicId] ASC");
			sb.AppendLine(")WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]");
			sb.AppendLine(") ON [PRIMARY]");

			sb.AppendLine("ALTER TABLE [CRM].[VisitTopic] ADD  CONSTRAINT [DF_VisitTopic_IsActive]  DEFAULT ((1)) FOR [IsActive]");
			sb.AppendLine("ALTER TABLE [CRM].[VisitTopic] ADD  CONSTRAINT [DF_VisitTopic_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]");
			sb.AppendLine("ALTER TABLE [CRM].[VisitTopic] ADD  CONSTRAINT [DF_VisitTopic_ModifyDate]  DEFAULT (getdate()) FOR [ModifyDate]");
			sb.AppendLine("ALTER TABLE [CRM].[VisitTopic] ADD  CONSTRAINT [DF_VisitTopic_CreateUser]  DEFAULT ('') FOR [CreateUser]");
			sb.AppendLine("ALTER TABLE [CRM].[VisitTopic] ADD  CONSTRAINT [DF_VisitTopic_ModifyUser]  DEFAULT ('') FOR [ModifyUser]");

			Database.ExecuteNonQuery(sb.ToString());
		}
		public override void Down()
		{
		}
	}
}