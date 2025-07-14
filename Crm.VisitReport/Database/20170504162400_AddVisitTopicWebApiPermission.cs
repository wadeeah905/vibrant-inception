namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170504162400)]
	public class AddVisitTopicWebApiPermission : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				IF NOT EXISTS (SELECT * FROM CRM.Permission WHERE PluginName = 'Crm.VisitReport' AND PGroup = 'WebAPI' AND Name = 'VisitTopic')
				INSERT INTO [CRM].[Permission] ([Name], [PluginName], [PGroup], [Status]) VALUES ('VisitTopic', 'Crm.VisitReport', 'WebAPI', 1)
			");
		}
	}
}