namespace Crm.Service.ViewModels
{
	using Crm.Library.Helper;
	using Crm.Library.ViewModels;
	using Crm.Service.Model;

	public class DispatchReportViewModel : HtmlTemplateViewModel, IDispatchReportViewModel
	{
		private readonly IAppSettingsProvider appSettingsProvider;
		public DispatchReportViewModel(ServiceOrderDispatch dispatch, IAppSettingsProvider appSettingsProvider)
		{
			this.appSettingsProvider = appSettingsProvider;

			Id = dispatch?.Id;
			ViewModel = "Crm.Service.ViewModels.DispatchReportPreviewModalViewModel";
		}

		public virtual double FooterContentSize => appSettingsProvider.GetValue(MainPlugin.Settings.Report.FooterHeight);
		public virtual double FooterContentSpacing => appSettingsProvider.GetValue(MainPlugin.Settings.Report.FooterMargin);
		public virtual double HeaderContentSize => appSettingsProvider.GetValue(MainPlugin.Settings.Report.HeaderHeight);
		public virtual double HeaderContentSpacing => appSettingsProvider.GetValue(MainPlugin.Settings.Report.HeaderMargin);
	}
}
