namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130611092200)]
	public class CreateLuContactPersonRelationshipType : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("CREATE TABLE [LU].[ContactPersonRelationshipType](");
			sb.AppendLine("[ContactPersonRelationshipTypeId] [int] IDENTITY(1,1) NOT NULL,");
			sb.AppendLine("[Name] [nvarchar](250) NOT NULL,");
			sb.AppendLine("[Language] [nvarchar](2) NOT NULL,");
			sb.AppendLine("[Value] [nvarchar](20) NOT NULL,");
			sb.AppendLine("[Favorite] [bit] NOT NULL,");
			sb.AppendLine("[SortOrder] [int] NOT NULL,");
			sb.AppendLine("CONSTRAINT [PK_ContactPersonRelationshipType] PRIMARY KEY CLUSTERED ");
			sb.AppendLine("(");
			sb.AppendLine("[ContactPersonRelationshipTypeId] ASC");
			sb.AppendLine(")WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]");
			sb.AppendLine(") ON [PRIMARY]");

			sb.AppendLine("ALTER TABLE [LU].[ContactPersonRelationshipType] ADD  CONSTRAINT [DF_ContactPersonRelationshipType_Language]  DEFAULT ('en') FOR [Language]");
			sb.AppendLine("ALTER TABLE [LU].[ContactPersonRelationshipType] ADD  CONSTRAINT [DF_ContactPersonRelationshipType_Value]  DEFAULT ((0)) FOR [Value]");
			sb.AppendLine("ALTER TABLE [LU].[ContactPersonRelationshipType] ADD  CONSTRAINT [DF_ContactPersonRelationshipType_Favorite]  DEFAULT ((0)) FOR [Favorite]");
			sb.AppendLine("ALTER TABLE [LU].[ContactPersonRelationshipType] ADD  CONSTRAINT [DF_ContactPersonRelationshipType_SortOrder]  DEFAULT ((0)) FOR [SortOrder]");

			Database.ExecuteNonQuery(sb.ToString());
		}
		public override void Down()
		{
		}
	}
}