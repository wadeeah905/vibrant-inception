namespace Crm.VisitReport
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
			CacheJs("visitReportMaterialJs");
			CacheJs("visitReportMaterialTs");
			Cache("ContactPersonRelationship", "EditTemplate");
			Cache("Topic", "EditTemplate");
			Cache("Visit", "CreateTemplate");
			Cache("Visit", "DetailsTemplate");
			Cache("Visit", "EditTemplate");
			Cache("VisitList", "CircuitVisitIndexTemplate");
			Cache("VisitList", "FilterTemplate");
			Cache("VisitList", "IndexTemplate");
			Cache("VisitList", "PreparedVisitIndexTemplate");
			Cache("VisitList", "RecommendedVisitIndexTemplate");
			Cache("VisitReport", "CreateTemplate");
			Cache("VisitReport", "DetailsTemplate");
			Cache("VisitReport", "EditTemplate");
			Cache("VisitReportList", "FilterTemplate");
		}
	}
}