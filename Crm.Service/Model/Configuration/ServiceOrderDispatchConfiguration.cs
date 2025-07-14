namespace Crm.Service.Model.Configuration
{
	using Crm.Library.EntityConfiguration;
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Model;
	using Crm.Service.Enums;

	public class ServiceOrderDispatchConfiguration : EntityConfiguration<ServiceOrderDispatch>
	{
		private readonly IAppSettingsProvider appSettingsProvider;
		public override void Initialize()
		{
			NestedProperty(x => x.OrderHead.OrderNo, c =>
			{
				c.Sortable();
				c.Filterable();
			});
			NestedProperty(x => x.OrderHead.PurchaseOrderNo, c => { c.Filterable(); });
			
			Property(x => x.DispatchNo, c =>
			{
				c.Filterable();
				c.Sortable();
			});
			Property(x => x.Status, c => c.Filterable());
			Property(x => x.DispatchedUsername, m => m.Filterable(f =>
			{
				f.Definition(new UserFilterDefinition { WithGroups = false });
				f.Caption("Technician");
			}));

			var maintenanceOrderGenerationMode = appSettingsProvider.GetValue(ServicePlugin.Settings.ServiceContract.MaintenanceOrderGenerationMode);
			if (maintenanceOrderGenerationMode == MaintenanceOrderGenerationMode.OrderPerInstallation)
			{
				NestedProperty(x => x.OrderHead.InstallationId, c => c.Filterable(f =>
				{
					f.Definition(new AutoCompleterFilterDefinition<Installation>("InstallationIdAutocomplete", new { Plugin = "Crm.Service" }, "CrmService_Installation", "Helper.Installation.getDisplayName", x => x.Id, x => x.InstallationNo, x => x.Description) { Caption = "Installation" });
				}));
			}

			NestedProperty(x => x.OrderHead.CustomerContactId, m => m.Filterable(f => f.Definition(new AutoCompleterFilterDefinition<Company>("CompanyAutocomplete", new { Plugin = "Main" }, "Main_Company", "Helper.Company.getDisplayName", x => x.Id, x => x.LegacyId, x => x.Name) { Caption = "Customer" })));
			NestedProperty(x => x.OrderHead.StationKey, c => c.Filterable(f =>
			{
				f.Definition(new AutoCompleterFilterDefinition<Station>(null, null, "Main_Station", "Helper.Station.getDisplayName", x => x.Id, filterFunction: "Helper.Station.getSelect2Filter") { Caption = "Station" });
			}));
			NestedProperty(x => x.OrderHead.Region, c => { c.Filterable(); });
			NestedProperty(x => x.OrderHead.ZipCode, c => { c.Filterable(); });
			NestedProperty(x => x.OrderHead.City, c => { c.Filterable(); });
			NestedProperty(x => x.OrderHead.Street, c => { c.Filterable(); });
			NestedProperty(x => x.OrderHead.ServiceObjectId, c => c.Filterable(filterable =>
			{
				filterable.Definition(new AutoCompleterFilterDefinition<ServiceObject>("ContactAutocomplete", new { Plugin = "Main", contactType = "ServiceObject" }, "CrmService_ServiceObject", "Helper.ServiceObject.getDisplayName", x => x.Id, x => x.ObjectNo, x => x.Name) { Caption = "ServiceObject" });
			}));

			Property(x => x.CreateDate, c =>
			{
				c.Sortable();
				c.Filterable(f => f.Definition(new DateFilterDefinition { AllowFutureDates = false, AllowPastDates = true }));
			});
			Property(x => x.ModifyDate, c =>
			{
				c.Sortable();
				c.Filterable(f => f.Definition(new DateFilterDefinition { AllowFutureDates = false, AllowPastDates = true }));
			});
			Property(x => x.StartTime, c =>
			{
				c.Sortable();
				c.Filterable(f => f.Definition(new DateFilterDefinition { AllowFutureDates = true, AllowPastDates = true }));
			});
			NestedProperty(x => x.OrderHead.Latitude, c => c.Filterable(f => f.Definition(new GeoCoordinateFilterDefinition())));
			NestedProperty(x => x.OrderHead.Longitude, c => c.Filterable(f => f.Definition(new GeoCoordinateFilterDefinition())));
		}
		public ServiceOrderDispatchConfiguration(IEntityConfigurationHolder<ServiceOrderDispatch> entityConfigurationHolder, IAppSettingsProvider appSettingsProvider)
			: base(entityConfigurationHolder)
		{
			this.appSettingsProvider = appSettingsProvider;
		}
	}
}