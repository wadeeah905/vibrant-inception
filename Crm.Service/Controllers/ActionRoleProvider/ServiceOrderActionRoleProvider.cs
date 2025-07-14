namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Article;
	using Crm.Library.Globalization;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Model;
	using Crm.Model.Notes;
	using Crm.Model.Relationships;
	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;

	using LMobile.Unicore;

	using User = Crm.Library.Model.User;

	public class ServiceOrderActionRoleProvider : RoleCollectorBase
	{
		public ServiceOrderActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(ArticlePlugin.PermissionGroup.Article,
						PermissionName.Index,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.DocumentAttribute,
						PermissionName.Index,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.Note,
						PermissionName.Create,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.Note,
						PermissionName.Delete,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.Note,
						PermissionName.Edit,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.Note,
						PermissionName.Index,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.Note,
						PermissionName.View,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
					PermissionName.Read,
							ServicePlugin.Roles.ServicePlanner,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService,
							MainPlugin.Roles.HeadOfSales,
							MainPlugin.Roles.SalesBackOffice,
							MainPlugin.Roles.InternalSales);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read, MainPlugin.PermissionGroup.Company, PermissionName.Read);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Read);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read, ServicePlugin.PermissionGroup.ServiceContract, PermissionName.Read);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Read);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Index);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read, MainPlugin.PermissionGroup.Person, PermissionName.Read);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
						PermissionName.Create,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Create, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Index);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Create, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read);

			Add(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.DownloadAsPdf, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
						PermissionName.Edit,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Create);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.DeleteMaterial);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.NoInvoice);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.RemoveSkill);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.SetHeadCommissioningStatus);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.SetHeadStatus);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.TimeDeleteSelfCreated);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.TimePostingRemove);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
						PermissionName.View,
							ServicePlugin.Roles.ServicePlanner,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.InternalService,
							MainPlugin.Roles.HeadOfSales,
							MainPlugin.Roles.SalesBackOffice,
							MainPlugin.Roles.InternalSales);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
						PermissionName.Index,
							ServicePlugin.Roles.ServicePlanner,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService,
							MainPlugin.Roles.HeadOfSales,
							MainPlugin.Roles.SalesBackOffice,
							MainPlugin.Roles.InternalSales);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
						PermissionName.Delete,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Delete, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Edit);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
				ServicePlugin.PermissionName.SetHeadStatus,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);
			Add(ServicePlugin.PermissionGroup.ServiceOrder,
				ServicePlugin.PermissionName.SetAdditionalHeadStatuses,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
				ServicePlugin.PermissionName.SetAdditionalHeadStatuses,
				ServicePlugin.Roles.HeadOfService,
				ServicePlugin.Roles.ServiceBackOffice,
				ServicePlugin.Roles.InternalService);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
				ServicePlugin.PermissionName.NoInvoice,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
				ServicePlugin.PermissionName.SetHeadCommissioningStatus,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService);

			Add(ServicePlugin.PermissionGroup.ServiceOrder,
				ServicePlugin.PermissionName.SetInvoicingType,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService);

			Add(MainPlugin.PermissionGroup.DocumentArchive,
						PermissionName.Create,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.DocumentArchive,
					PermissionName.Index,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.DocumentArchive,
					PermissionName.Delete,
							ServicePlugin.Roles.HeadOfService,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.Task,
						MainPlugin.PermissionName.Complete,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.Task,
						PermissionName.Create,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.Task,
						PermissionName.Index,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(MainPlugin.PermissionGroup.Task,
						PermissionName.Edit,
							ServicePlugin.Roles.ServiceBackOffice,
							ServicePlugin.Roles.InternalService,
							ServicePlugin.Roles.FieldService);

			Add(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.CreateTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.CreateTag, ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.RemoveTag);
			Add(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.AssociateTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.AssociateTag, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.RenameTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.RenameTag, ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.DeleteTag);
			Add(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.RemoveTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.RemoveTag, ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.AssociateTag);
			Add(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.DeleteTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.DeleteTag, ServicePlugin.PermissionGroup.ServiceOrder, MainPlugin.PermissionName.CreateTag);

			Add(ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.DispatchesTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.DispatchesTab, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.SeeAllUsersServiceOrders, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.SeeAllUsersServiceOrders, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Index);

			Add(nameof(ServiceOrderType), ServicePlugin.PermissionName.SelectNonMobileLookupValues, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);

			Add(PermissionGroup.WebApi, nameof(ServiceOrderStatus), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.InternalSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ServiceOrderInvoiceReason), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.InternalSales, Roles.APIUser);

			Add(ServicePlugin.PermissionGroup.ServiceOrderTemplate, PermissionName.Create, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(ServicePlugin.PermissionGroup.ServiceOrderTemplate, PermissionName.Edit, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(ServicePlugin.PermissionGroup.ServiceOrderTemplate, PermissionName.View, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(ServicePlugin.PermissionGroup.ServiceOrderTemplate, PermissionName.Index, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(ServicePlugin.PermissionGroup.ServiceOrderTemplate, ServicePlugin.PermissionName.JobsTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(ServicePlugin.PermissionGroup.ServiceOrderTemplate, PermissionName.Read, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(ServicePlugin.PermissionGroup.ServiceOrderTemplate, ServicePlugin.PermissionName.TimeAdd, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);

			Add(PermissionGroup.WebApi, nameof(Address), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Bravo), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(BusinessRelationship), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(CauseOfFailure), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Company), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(CompanyPersonRelationship), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Component), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(DocumentAttribute), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Domain), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Email), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(ErrorCode), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Fax), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(FileResource), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(LinkResource), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Language), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Manufacturer), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Note), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Permission), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(PermissionSchemaRole), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Person), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Phone), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(ServiceOrderHead), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ServiceOrderInvoiceReason), ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(ServiceOrderNoInvoiceReason), ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(ServiceOrderType), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ServicePriority), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(Tag), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Task), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(User), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(UserNote), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Usergroup), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(Website), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
		}
	}
}
