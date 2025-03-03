namespace Sms.Scheduler
{
	using System;
	using System.Collections.Generic;

	using Crm.Library.Modularization.Menu;
	using System.Runtime.CompilerServices;

	using Crm.Library.Model.Authorization.PermissionIntegration;

	using PermissionGroup = SchedulerPlugin.PermissionGroup;

	public class SchedulerMenuRegistrar : IMenuRegistrar<MaterialUserProfileMenu>
	{
		[MethodImpl(MethodImplOptions.NoInlining)]
		public void Initialize(MenuProvider<MaterialUserProfileMenu> menuProvider)
		{
			menuProvider.Register(null, "WebScheduler", url: "~/Sms.Scheduler/Scheduler/DetailsTemplate", iconClass: "zmdi zmdi-desktop-windows", priority: Int32.MaxValue - 20, htmlAttributes: new Dictionary<string, object> { { "data-bind", "if: !window.Helper.Offline || window.Helper.Offline.status == 'online'" } });
			menuProvider.AddPermission(null, "WebScheduler", PermissionGroup.Scheduler, PermissionName.View);
			menuProvider.AddPermission(null, "WebScheduler", Crm.Library.Model.Authorization.PermissionGroup.WebApi, SchedulerPlugin.PermissionName.SchedulerClient);
		}
	}
}
