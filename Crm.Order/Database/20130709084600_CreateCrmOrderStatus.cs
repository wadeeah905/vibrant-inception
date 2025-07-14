namespace Crm.Order.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130709084600)]
	public class CreateCrmOrderStatus : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[LU].[OrderStatus]"))
			{

				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("IF NOT EXISTS(select * from sys.tables");
				stringBuilder.AppendLine("where name = 'OrderStatus'");
				stringBuilder.AppendLine("and schema_id = schema_id('LU'))");

				stringBuilder.AppendLine("CREATE TABLE [LU].[OrderStatus](");
				stringBuilder.AppendLine("[StatusId] [int] IDENTITY(1,1) NOT NULL,");
				stringBuilder.AppendLine("[Name] [nvarchar](64) NOT NULL,");
				stringBuilder.AppendLine("[Language] [nvarchar](2) NOT NULL,");
				stringBuilder.AppendLine("[Value] [nvarchar](50) NOT NULL,");
				stringBuilder.AppendLine("[Favorite] [bit] NOT NULL,");
				stringBuilder.AppendLine("[SortOrder] [int] NOT NULL,");
				stringBuilder.AppendLine("[TenantKey] [int] NULL,");
				stringBuilder.AppendLine("CONSTRAINT [StatusId] PRIMARY KEY CLUSTERED ");
				stringBuilder.AppendLine("(");
				stringBuilder.AppendLine("[StatusId] ASC");
				stringBuilder.AppendLine(")WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]");
				stringBuilder.AppendLine(") ON [PRIMARY]");
		
				stringBuilder.AppendLine("INSERT INTO [LU].[OrderStatus]");
				stringBuilder.AppendLine("([Name]");
				stringBuilder.AppendLine(",[Language]");
				stringBuilder.AppendLine(",[Value]");
				stringBuilder.AppendLine(",[Favorite]");
				stringBuilder.AppendLine(",[SortOrder])");
				stringBuilder.AppendLine("VALUES");
				stringBuilder.AppendLine("('Offen'");
				stringBuilder.AppendLine(",'de'");
				stringBuilder.AppendLine(",'Open'");
				stringBuilder.AppendLine(",0");
				stringBuilder.AppendLine(",0)");
				stringBuilder.AppendLine("INSERT INTO [LU].[OrderStatus]");
				stringBuilder.AppendLine("([Name]");
				stringBuilder.AppendLine(",[Language]");
				stringBuilder.AppendLine(",[Value]");
				stringBuilder.AppendLine(",[Favorite]");
				stringBuilder.AppendLine(",[SortOrder])");
				stringBuilder.AppendLine("VALUES");
				stringBuilder.AppendLine("('Geschlossen'");
				stringBuilder.AppendLine(",'de'");
				stringBuilder.AppendLine(",'Closed'");
				stringBuilder.AppendLine(",0");
				stringBuilder.AppendLine(",1)");
				stringBuilder.AppendLine("INSERT INTO [LU].[OrderStatus]");
				stringBuilder.AppendLine("([Name]");
				stringBuilder.AppendLine(",[Language]");
				stringBuilder.AppendLine(",[Value]");
				stringBuilder.AppendLine(",[Favorite]");
				stringBuilder.AppendLine(",[SortOrder])");
				stringBuilder.AppendLine("VALUES");
				stringBuilder.AppendLine("('Open'");
				stringBuilder.AppendLine(",'en'");
				stringBuilder.AppendLine(",'Open'");
				stringBuilder.AppendLine(",0");
				stringBuilder.AppendLine(",0)");
				stringBuilder.AppendLine("INSERT INTO [LU].[OrderStatus]");
				stringBuilder.AppendLine("([Name]");
				stringBuilder.AppendLine(",[Language]");
				stringBuilder.AppendLine(",[Value]");
				stringBuilder.AppendLine(",[Favorite]");
				stringBuilder.AppendLine(",[SortOrder])");
				stringBuilder.AppendLine("VALUES");
				stringBuilder.AppendLine("('Closed'");
				stringBuilder.AppendLine(",'en'");
				stringBuilder.AppendLine(",'Closed'");
				stringBuilder.AppendLine(",0");
				stringBuilder.AppendLine(",1)");

				Database.ExecuteNonQuery(stringBuilder.ToString());
			}
		}
		public override void Down()
		{

		}
	}
}
