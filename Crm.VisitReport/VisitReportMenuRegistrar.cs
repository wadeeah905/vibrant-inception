namespace Crm.VisitReport
{
	using System;

	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Menu;

	public class VisitReportMenuRegistrar : IMenuRegistrar<MaterialMainMenu>
	{
		public virtual void Initialize(MenuProvider<MaterialMainMenu> menuProvider)
		{
			menuProvider.Register(null, "Sales", iconClass: "zmdi zmdi-money-box", priority: Int32.MaxValue - 100);
			menuProvider.Register("Sales", "TourPlanning", priority: 100, url: "~/Crm.VisitReport/VisitList/IndexTemplate");
			menuProvider.AddPermission("Sales", "TourPlanning", VisitReportPlugin.PermissionGroup.Visit, PermissionName.View);
		}
	}
}
