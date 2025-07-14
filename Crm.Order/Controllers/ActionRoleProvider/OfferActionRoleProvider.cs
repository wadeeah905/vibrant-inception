namespace Crm.Order.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	public class OfferActionRoleProvider : RoleCollectorBase
	{
		public OfferActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(MainPlugin.PermissionGroup.Company, OrderPlugin.PermissionName.OfferTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(MainPlugin.PermissionGroup.Company, OrderPlugin.PermissionName.OfferTab, MainPlugin.PermissionGroup.Company, PermissionName.Read);

			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.View, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.Index, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.Read, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.Read, OrderPlugin.PermissionGroup.Offer, PermissionName.Index);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.Create, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.Create, OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.PreviewOffer);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.Create, OrderPlugin.PermissionGroup.Offer, PermissionName.Edit);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.Edit, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.Edit, OrderPlugin.PermissionGroup.Offer, PermissionName.Load);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.Load, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.Load, OrderPlugin.PermissionGroup.Offer, PermissionName.Index);

			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.AddAccessory, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.AddAlternative, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.AddDelivery, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.AddOption, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.PreviewOffer, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.SendOffer, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.SimpleTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.TreeTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.TreeTab, OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.AddDelivery);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.CreateOrderFromOffer, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.SeeAllUsersOffers, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.SeeAllUsersOffers, OrderPlugin.PermissionGroup.Offer, PermissionName.Read);
		}
	}
}