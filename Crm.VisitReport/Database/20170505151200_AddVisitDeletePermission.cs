namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170505151200)]
	public class AddVisitDeletePermission : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				IF NOT EXISTS (SELECT * FROM CRM.Permission WHERE PluginName = 'Crm.VisitReport' AND PGroup = 'Visit' AND Name = 'Delete')
				INSERT INTO [CRM].[Permission] ([Name], [PluginName], [PGroup], [Status]) VALUES ('Delete', 'Crm.VisitReport', 'Visit', 1)
			");
		}
	}
}