namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170515140900)]
	public class AddTopicPermissions : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				IF NOT EXISTS (SELECT * FROM CRM.Permission WHERE PluginName = 'Crm.VisitReport' AND PGroup = 'Topic' AND Name = 'Edit')
				INSERT INTO [CRM].[Permission] ([Name], [PluginName], [PGroup], [Status]) VALUES ('Edit', 'Crm.VisitReport', 'Topic', 1)
			");
			Database.ExecuteNonQuery(@"
				IF NOT EXISTS (SELECT * FROM CRM.Permission WHERE PluginName = 'Crm.VisitReport' AND PGroup = 'Topic' AND Name = 'Delete')
				INSERT INTO [CRM].[Permission] ([Name], [PluginName], [PGroup], [Status]) VALUES ('Delete', 'Crm.VisitReport', 'Topic', 1)
			");
			Database.ExecuteNonQuery(@"
				IF NOT EXISTS (SELECT * FROM CRM.Permission WHERE PluginName = 'Crm.VisitReport' AND PGroup = 'Topic' AND Name = 'Create')
				INSERT INTO [CRM].[Permission] ([Name], [PluginName], [PGroup], [Status]) VALUES ('Create', 'Crm.VisitReport', 'Topic', 1)
			");
		}
	}
}