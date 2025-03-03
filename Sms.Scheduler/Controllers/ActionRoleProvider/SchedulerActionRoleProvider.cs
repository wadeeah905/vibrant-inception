namespace Sms.Scheduler.Controllers.ActionRoleProvider
{
	using System.Linq;

	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Service;

	using Sms.Scheduler.Model;

	public class SchedulerActionRoleProvider : RoleCollectorBase
	{
		public SchedulerActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			var roles = new[] { ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServicePlanner, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService };
			
			Add(SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.Index, roles);
			Add(SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.View, roles);
			AddImport(SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.View, SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.Index);
			AddImport(SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.View, PermissionGroup.Login, SchedulerPlugin.PermissionName.SchedulerClient);
			Add(SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.Read, roles);
			AddImport(SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.Read, SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.View);
			Add(SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.Edit, roles);
			AddImport(SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.Edit, SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.Read);
			Add(SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.Delete, roles);
			AddImport(SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.Delete, SchedulerPlugin.PermissionGroup.Scheduler, PermissionName.Edit);
			Add(SchedulerPlugin.PermissionGroup.Scheduler, SchedulerPlugin.PermissionName.AddProfile, roles);
			Add(SchedulerPlugin.PermissionGroup.Scheduler, SchedulerPlugin.PermissionName.EditProfile, roles);
			AddImport(SchedulerPlugin.PermissionGroup.Scheduler, SchedulerPlugin.PermissionName.EditProfile, SchedulerPlugin.PermissionGroup.Scheduler, SchedulerPlugin.PermissionName.AddProfile);
			Add(SchedulerPlugin.PermissionGroup.Scheduler, SchedulerPlugin.PermissionName.DeleteProfile, roles);
			AddImport(SchedulerPlugin.PermissionGroup.Scheduler, SchedulerPlugin.PermissionName.DeleteProfile, SchedulerPlugin.PermissionGroup.Scheduler, SchedulerPlugin.PermissionName.EditProfile);
			Add(SchedulerPlugin.PermissionGroup.Scheduler, SchedulerPlugin.PermissionName.CanSeeOtherUsersProfile, roles);
			Add(PermissionGroup.Login, SchedulerPlugin.PermissionName.SchedulerClient, roles);

			Add(PermissionGroup.WebApi, SchedulerPlugin.PermissionName.SchedulerClient, roles);
			Add(PermissionGroup.WebApi, nameof(Profile), roles);
			Add(PermissionGroup.WebApi, nameof(ProfileResource), roles);
			Add(PermissionGroup.WebApi, nameof(DispatchPersonAssignment), roles);
			Add(PermissionGroup.WebApi, nameof(DispatchArticleAssignment), roles);
			Add(PermissionGroup.WebApi, nameof(Absence), roles);
				Add(PermissionGroup.Sync, nameof(Absence));
				AddImport(PermissionGroup.Sync, nameof(Absence), PermissionGroup.WebApi, nameof(Absence));
		}
	}
}
