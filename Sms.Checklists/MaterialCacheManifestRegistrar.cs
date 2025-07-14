namespace Sms.Checklists
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
			CacheJs("smsChecklistsMaterialJs");
			CacheJs("smsChecklistsMaterialTs");
			Cache("ServiceCase", "CreateTemplateForm");
			Cache("ServiceCaseChecklist", "DetailsTemplate");
			Cache("ServiceCaseChecklist", "EditTemplate");
			Cache("ServiceCaseChecklistList", "FilterTemplate");
			Cache("ServiceOrderChecklist", "CreateTemplate");
			Cache("ServiceOrderChecklist", "DetailsTemplate");
			Cache("ServiceOrderChecklist", "EditTemplate");
			Cache("ServiceOrderChecklist", "CreatePdfTemplate");
			Cache("ServiceOrderChecklist", "DetailsPdfTemplate");
			Cache("ServiceOrderChecklist", "EditPdfTemplate");
			Cache("ServiceOrderChecklist", "Viewer");
			Cache("ServiceOrderChecklistList", "FilterTemplate");
		}
	}
}
