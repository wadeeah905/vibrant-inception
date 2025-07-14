namespace Crm.VisitReport.Database
{
	using System.Collections.Generic;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;
	using Crm.Library.Extensions;

	[Migration(20121023103316)]
	public class AddNewPermissionForVisitReportReporting : Migration
	{
		public override void Up()
		{
			var permission = "ViewVisitReportReporting";
			int permissionId;

			var adminId = Database.ExecuteScalar("SELECT RoleId FROM Crm.Role WHERE Name = 'Administrator'") as int?;

			Database.InsertIfNotExists("Crm.Permission", new[] { "Name", "PluginName" }, new[] { permission, "Crm.VisitReport" });
			permissionId = (int)Database.ExecuteScalar("SELECT PermissionId FROM Crm.Permission WHERE Name = '{0}' AND PluginName = 'Crm.VisitReport'".WithArgs(permission));

			if (adminId == null)
			{
				return;
			}

			Database.InsertIfNotExists("Crm.RolePermission", new[] { "RoleKey", "PermissionKey" }, new[] { adminId.ToString(), permissionId.ToString() });
			
			var reader = Database.ExecuteQuery("SELECT Username FROM Crm.UserRole WHERE RoleKey = {0}".WithArgs(adminId));
			var usernames = new List<string>();
			while (reader.Read())
			{
				var username = (string)reader["Username"];
				usernames.Add(username);
			}
			reader.Close();
			foreach (string username in usernames)
			{
				Database.InsertIfNotExists("Crm.UserPermission", new[] { "Username", "PermissionKey" }, new[] { username, permissionId.ToString() });
			}
		}
		public override void Down()
		{
		}
	}
}