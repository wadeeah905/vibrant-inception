namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120101030000)]
	public class CreateVisitPossibleAim : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[VisitPossibleAim]"))
			{

				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("CREATE TABLE [CRM].[VisitPossibleAim](");
				stringBuilder.AppendLine("[VisitPossibleAimId] [int] IDENTITY(1,1) NOT NULL,");
				stringBuilder.AppendLine("[Text] [nvarchar](256) NOT NULL,");
				stringBuilder.AppendLine("CONSTRAINT [PK_VisitAim] PRIMARY KEY CLUSTERED ");
				stringBuilder.AppendLine("(");
				stringBuilder.AppendLine("[VisitPossibleAimId] ASC");
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
