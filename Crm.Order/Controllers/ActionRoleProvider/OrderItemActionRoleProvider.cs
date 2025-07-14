namespace Crm.Order.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	public class OrderItemActionRoleProvider : RoleCollectorBase
	{
		public OrderItemActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			
			Add(OrderPlugin.PermissionGroup.OfferItem, PermissionName.Remove, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.OrderItem, PermissionName.Remove, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
		}
	}
}