namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170504095200)]
	public class AddContactPersonRelationshipEditPermissions : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				IF NOT EXISTS (SELECT * FROM CRM.Permission WHERE PluginName = 'Crm.VisitReport' AND PGroup = 'Person' AND Name = 'SaveBusinessRelationship')
				INSERT INTO [CRM].[Permission] ([Name], [PluginName], [PGroup], [Status]) VALUES ('SaveBusinessRelationship', 'Crm.VisitReport', 'Person', 1)
			");
			Database.ExecuteNonQuery(@"
				IF NOT EXISTS (SELECT * FROM CRM.Permission WHERE PluginName = 'Crm.VisitReport' AND PGroup = 'Person' AND Name = 'DeleteBusinessRelationship')
				INSERT INTO [CRM].[Permission] ([Name], [PluginName], [PGroup], [Status]) VALUES ('DeleteBusinessRelationship', 'Crm.VisitReport', 'Person', 1)
			");
		}
	}
}