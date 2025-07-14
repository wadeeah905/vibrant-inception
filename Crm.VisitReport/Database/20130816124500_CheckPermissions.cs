namespace Crm.VisitReport.Database
{
	using System.Text;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130816124500)]
	public class CheckPermissions  : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'CreateVisitReport') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('CreateVisitReport','Crm.VisitReport') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditVisitReport') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('EditVisitReport','Crm.VisitReport') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'DeleteVisitReport') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('DeleteVisitReport','Crm.VisitReport') END");

			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditVisitPossibleAims') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('EditVisitPossibleAims','Crm.VisitReport') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditVisitReportPossibleAnswers') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('EditVisitReportPossibleAnswers','Crm.VisitReport') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'SeeAllUsersVisitReports') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('SeeAllUsersVisitReports','Crm.VisitReport') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditAllUsersVisitReports') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('EditAllUsersVisitReports','Crm.VisitReport') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'ViewVisitReportReporting') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('ViewVisitReportReporting','Crm.VisitReport') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'SeeAllUsersTourPlanning') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('SeeAllUsersTourPlanning','Crm.VisitReport') END");
			sb.AppendLine("IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditAllUsersTourPlanning') BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName) VALUES ('EditAllUsersTourPlanning','Crm.VisitReport') END");

			Database.ExecuteNonQuery(sb.ToString());
		}

		public override void Down()
		{

		}
	}
}