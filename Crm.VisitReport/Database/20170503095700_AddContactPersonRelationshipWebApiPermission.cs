namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170503095700)]
	public class AddContactPersonRelationshipWebApiPermission : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				IF NOT EXISTS (SELECT * FROM CRM.Permission WHERE PluginName = 'Crm.VisitReport' AND PGroup = 'WebAPI' AND Name = 'ContactPersonRelationship')
				INSERT INTO [CRM].[Permission] ([Name], [PluginName], [PGroup], [Status]) VALUES ('ContactPersonRelationship', 'Crm.VisitReport', 'WebAPI', 1)
			");
		}
	}
}