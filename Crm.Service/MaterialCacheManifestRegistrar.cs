namespace Crm.Service
{

	using Crm.Library.Modularization.Interfaces;
	using Crm.Library.Offline;
	using Crm.Library.Offline.Interfaces;

	public class MaterialCacheManifestRegistrar : CacheManifestRegistrar<MaterialCacheManifest>
	{
		public MaterialCacheManifestRegistrar(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
		}

		protected override void Initialize()
		{
			CacheJs("serviceMaterialJs");
			CacheJs("serviceMaterialTs");
			CacheCss("installationCss");
			Cache("Dispatch", "AdHocTemplate");
			Cache("Dispatch", "Appointment");
			Cache("Dispatch", "ChangeStatusTemplate");
			Cache("Dispatch", "DetailsTemplate");
			Cache("Dispatch", "DocumentAttributeEditTemplate");
			Cache("Dispatch", "RejectTemplate");
			Cache("Dispatch", "ReportPreview");
			Cache("Dispatch", "ReportRecipientsTemplate");
			Cache("Dispatch", "Schedule");
			Cache("Dispatch", "SignatureEdit");
			Cache("Installation", "CreateTemplate");
			Cache("Installation", "DetailsTemplate");
			Cache("Installation", "DocumentAttributeEditTemplate");
			Cache("InstallationAddressRelationship", "EditTemplate");
			Cache("InstallationList", "FilterTemplate");
			Cache("InstallationList", "IndexTemplate");
			Cache("InstallationPosition", "EditTemplate");
			Cache("MaintenancePlan", "EditTemplate");
			Cache("ReplenishmentOrder", "ReportPreview");
			Cache("ReplenishmentOrderItem", "Edit");
			Cache("ReplenishmentOrderItemList", "FilterTemplate");
			Cache("ReplenishmentOrderItemList", "IndexTemplate");
			Cache("ServiceContract", "CreateTemplate");
			Cache("ServiceContract", "DetailsTemplate");
			Cache("ServiceContract", "DocumentAttributeEditTemplate");
			Cache("ServiceContractAddressRelationship", "EditTemplate");
			Cache("ServiceContractInstallationRelationship", "EditTemplate");
			Cache("ServiceContractList", "FilterTemplate");
			Cache("ServiceContractList", "IndexTemplate");
			Cache("ServiceCase", "CreateTemplate");
			Cache("ServiceCase", "DetailsTemplate");
			Cache("ServiceCaseList", "FilterTemplate");
			Cache("ServiceCaseList", "IndexTemplate");
			Cache("ServiceCaseTemplate", "CreateTemplate");
			Cache("ServiceCaseTemplate", "DetailsTemplate");
			Cache("ServiceCaseTemplateList", "FilterTemplate");
			Cache("ServiceCaseTemplateList", "IndexTemplate");
			Cache("ServiceCaseTemplate", "DetailsTemplate");
			Cache("ServiceCaseTemplateList", "FilterTemplate");
			Cache("ServiceCaseTemplateList", "IndexTemplate");
			Cache("ServiceObject", "AddInstallation");
			Cache("ServiceObject", "CreateTemplate");
			Cache("ServiceObject", "DetailsTemplate");
			Cache("ServiceObjectList", "FilterTemplate");
			Cache("ServiceObjectList", "IndexTemplate");
			Cache("ServiceOrderDispatchList", "FilterTemplate");
			Cache("ServiceOrderDispatchList", "GetIcsLink");
			Cache("ServiceOrderDispatchList", "IndexTemplate");
			Cache("ServiceOrderDispatchList", "TodaysDispatches");
			Cache("ServiceOrderHeadList", "FilterTemplate");
			Cache("ServiceOrderHeadList", "IndexTemplate");
			Cache("ServiceOrder", "CreateTemplate");
			Cache("ServiceOrder", "CloseTemplate");
			Cache("ServiceOrder", "DetailsTemplate");
			Cache("ServiceOrderMaterial", "EditTemplate");
			Cache("ServiceOrderMaterialList", "FilterTemplate");
			Cache("ServiceOrderTemplate", "Create");
			Cache("ServiceOrderTemplate", "Details");
			Cache("ServiceOrderTemplateList", "FilterTemplate");
			Cache("ServiceOrderTemplateList", "IndexTemplate");
			Cache("ServiceOrderTime", "EditTemplate");
			Cache("ServiceOrderTimeList", "FilterTemplate");
			Cache("ServiceOrderTimePosting", "EditTemplate");
			Cache("ServiceOrderTimePostingList", "FilterTemplate");
			Cache("StatisticsKey", "EditTemplate");
			Cache("StatisticsKey", "InfoTemplate");
			Cache("StoreList", "IndexTemplate");
			Cache("StoreList", "FilterTemplate");
		}
	}
}
