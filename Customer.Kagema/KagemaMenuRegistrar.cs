
namespace Customer.Kagema

{
	using PermissionGroupService = Crm.Service.ServicePlugin.PermissionGroup;


	using Crm.Library.Modularization.Menu;
	using Crm.Library.Model.Authorization.PermissionIntegration;

	public class KagemaMenuRegistrar : IMenuRegistrar<MaterialMainMenu>
	{
		public virtual void Initialize(MenuProvider<MaterialMainMenu> menuProvider)
		{
			menuProvider.Register("ERPIntegration", "ServiceOrderExportErrors", priority: 300, url: "~/Customer.Kagema/ServiceOrderExportErrorsList/IndexTemplate");
			menuProvider.AddPermission("ERPIntegration", "ServiceOrderExportErrors", PermissionGroupService.ServiceOrder, PermissionName.View);
		}
	}
}
