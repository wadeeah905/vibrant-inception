namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130611130400)]
	public class InsertDefaultValueIntoLuContactPersonRelationshipType : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("IF NOT EXISTS (SELECT 1 FROM [LU].[ContactPersonRelationshipType] WHERE Value = '100')");
			sb.AppendLine("BEGIN");
			sb.AppendLine("INSERT INTO [LU].[ContactPersonRelationshipType]");
			sb.AppendLine("([Name]");
			sb.AppendLine(",[Language]");
			sb.AppendLine(",[Value]");
			sb.AppendLine(",[Favorite]");
			sb.AppendLine(",[SortOrder])");
			sb.AppendLine("VALUES");
			sb.AppendLine("('Teilnehmer'");
			sb.AppendLine(",'de'");
			sb.AppendLine(",'100'");
			sb.AppendLine(",0");
			sb.AppendLine(",0),");
			sb.AppendLine("('Participant'");
			sb.AppendLine(",'en'");
			sb.AppendLine(",'100'");
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