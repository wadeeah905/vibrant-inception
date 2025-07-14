namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150414155800)]
	public class AddNewVisitReportPermissions : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(
				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'Create' AND PGroup = 'VisitReport')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('Create', 'Crm.VisitReport', 1, 'VisitReport') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'ViewAllReporting' AND PGroup = 'VisitReport')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('ViewAllReporting', 'Crm.VisitReport', 1, 'VisitReport') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditAllUsersVisitReports' AND PGroup = 'VisitReport')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('EditAllUsersVisitReports', 'Crm.VisitReport', 1, 'VisitReport') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'SeeAllUsersVisitReports' AND PGroup = 'VisitReport')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('SeeAllUsersVisitReports', 'Crm.VisitReport', 1, 'VisitReport') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'SeeAllUsersTourPlanning' AND PGroup = 'Visit')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('SeeAllUsersTourPlanning', 'Crm.VisitReport', 1, 'Visit') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'Create' AND PGroup = 'Visit')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('Create', 'Crm.VisitReport', 1, 'Visit') END " +

				"IF NOT EXISTS(SELECT * FROM [Crm].[Permission] WHERE Name = 'EditAllUsersTourPlanning' AND PGroup = 'Visit')" +
				"BEGIN INSERT INTO [Crm].[Permission] (Name,PluginName,Status,PGroup) VALUES ('EditAllUsersTourPlanning', 'Crm.VisitReport', 1, 'Visit') END "
				);
		}
	}
}
