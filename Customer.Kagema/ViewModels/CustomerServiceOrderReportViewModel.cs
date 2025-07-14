namespace Crm.Service.ViewModels
{
	using System.Linq;

	using Crm.Library.AutoFac;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Helper;
	using Crm.Service.Model;
	using Crm.Services.Interfaces;
	using Crm.Article.Model;
	public class CustomerServiceOrderReportViewModel : ServiceOrderReportViewModel, IReplaceRegistration<ServiceOrderReportViewModel>
	{
		public CustomerServiceOrderReportViewModel(ServiceOrderHead serviceOrder, IAppSettingsProvider appSettingsProvider, ILookupManager lookupManager, ISiteService siteService) : base(serviceOrder, appSettingsProvider, lookupManager, siteService)
		{
		}
		public Article[] articles => displayedTimePostings.Select(x => x.Article).ToArray();

	}
}
