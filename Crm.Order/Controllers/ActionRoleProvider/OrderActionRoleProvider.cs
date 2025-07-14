namespace Crm.Order.Controllers.ActionRoleProvider
{
	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Order.Model;
	using Crm.Order.Model.Lookups;

	public class OrderActionRoleProvider : RoleCollectorBase
	{
		public OrderActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(MainPlugin.PermissionGroup.Company, OrderPlugin.PermissionName.OrderTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(MainPlugin.PermissionGroup.Company, OrderPlugin.PermissionName.OrderTab, MainPlugin.PermissionGroup.Company, PermissionName.Read);

			Add(OrderPlugin.PermissionGroup.Order, PermissionName.View, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.Index, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.Read, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.Read, OrderPlugin.PermissionGroup.Order, PermissionName.Index);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.Create, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.Create, OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.PreviewOrder);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.Create, OrderPlugin.PermissionGroup.Order, PermissionName.Edit);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.Edit, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.Edit, OrderPlugin.PermissionGroup.Order, PermissionName.Load);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.Load, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.Load, OrderPlugin.PermissionGroup.Order, PermissionName.Read);

			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.AddAccessory, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.AddAccessory, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.AddDelivery, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.AddDelivery, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.Complete, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.PreviewOrder, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.PreviewOrder, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SimpleTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SimpleTab, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.TreeTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.TreeTab, OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.AddDelivery);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SummaryTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SummaryTab, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.CloseOrder, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.CloseOrder, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SendOrder, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SendOrder, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SeeAllUsersOrders, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SeeAllUsersOrders, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Calculation, OrderPlugin.PermissionName.ViewPurchasePrices, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);

			Add(PermissionGroup.WebApi, nameof(CalculationPosition), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(CalculationPositionType), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Offer), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Order), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderCategory), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderEntryType), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderItem), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderStatus), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderCancelReasonCategory), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
		}
	}
}
