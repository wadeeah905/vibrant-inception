namespace Crm.VisitReport.Database
{
	using System.Collections.Generic;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;
	using Crm.Library.Extensions;

	[Migration(20120519191305)]
	public class AddNewPermissionsForVisitReportsAndTourPlanning : Migration
	{
		public override void Up()
		{
			var permissions = new[]
				{
					"SeeAllUsersVisitReports",
					"EditAllUsersVisitReports",
					"SeeAllUsersTourPlanning",
					"EditAllUsersTourPlanning"
				};
			var permissionIds = new List<int>();

			var adminId = Database.ExecuteScalar("SELECT RoleId FROM Crm.Role WHERE Name = 'Administrator'") as int?;
			foreach (string permission in permissions)
			{
				Database.InsertIfNotExists("Crm.Permission", new[] { "Name", "PluginName" }, new[] { permission, "Crm.VisitReport" });

				var permissionId = (int)Database.ExecuteScalar("SELECT PermissionId FROM Crm.Permission WHERE Name = '{0}' AND PluginName = 'Crm.VisitReport'".WithArgs(permission));
				permissionIds.Add(permissionId);

				if (adminId != null)
				{
					Database.InsertIfNotExists("Crm.RolePermission", new[] { "RoleKey", "PermissionKey" }, new[] { adminId.ToString(), permissionId.ToString() });
				}
			}

			if (adminId == null)
			{
				return;
			}

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
				foreach (int permissionId in permissionIds)
				{
					Database.InsertIfNotExists("Crm.UserPermission", new[] { "Username", "PermissionKey" }, new[] { username, permissionId.ToString() });
				}
			}
		}
		public override void Down()
		{
		}
	}
}