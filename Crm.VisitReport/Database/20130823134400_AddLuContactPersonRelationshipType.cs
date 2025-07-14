namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130823134400)]
	public class AddLuContactPersonRelationshipType : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("IF NOT EXISTS (SELECT 1 FROM [LU].[ContactPersonRelationshipType] WHERE Name = '101')");
			sb.AppendLine("BEGIN");
			sb.AppendLine("INSERT INTO [LU].[ContactPersonRelationshipType]");
			sb.AppendLine("([Name]");
			sb.AppendLine(",[Language]");
			sb.AppendLine(",[Value]");
			sb.AppendLine(",[Favorite]");
			sb.AppendLine(",[SortOrder])");
			sb.AppendLine("VALUES");
			sb.AppendLine("('Eigener Mitarbeiter'");
			sb.AppendLine(",'de'");
			sb.AppendLine(",'101'");
			sb.AppendLine(",0");
			sb.AppendLine(",0),");
			sb.AppendLine("('Own Employee'");
			sb.AppendLine(",'en'");
			sb.AppendLine(",'101'");
			sb.AppendLine(",0");
			sb.AppendLine(",0)");
			sb.AppendLine("END");

			Database.ExecuteNonQuery(sb.ToString());
		}

		public override void Down()
		{
		}
	}
}