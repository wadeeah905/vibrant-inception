namespace Crm.Service.ViewModels
{
	using System.Linq;

	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Helper;
	using Crm.Service.Model;
	using Crm.Services.Interfaces;

	public class ServiceOrderReportViewModel : ServiceOrderReportViewModelBase, IServiceOrderReportViewModel
	{
		public ServiceOrderReportViewModel(ServiceOrderHead serviceOrder, IAppSettingsProvider appSettingsProvider, ILookupManager lookupManager, ISiteService siteService)
			: base(serviceOrder, appSettingsProvider, lookupManager, siteService)
		{
			Id = serviceOrder?.Id;
			ViewModel = "Crm.Service.ViewModels.ServiceOrderReportViewModel";
		}

		public override ServiceOrderMaterial[] displayedMaterials => serviceOrder.ServiceOrderMaterials.ToArray();
		public override ServiceOrderTimePosting[] displayedTimePostings => serviceOrder.ServiceOrderTimePostings.Where(x => x.UserUsername != null).ToList().OrderBy(p => p.Date.Date).ThenBy(p => p.From.GetValueOrDefault().TimeOfDay).ThenBy(p => p.To.GetValueOrDefault().TimeOfDay).ToArray();
	}
}
