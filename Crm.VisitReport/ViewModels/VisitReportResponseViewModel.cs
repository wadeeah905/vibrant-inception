namespace Crm.VisitReport.ViewModels
{
	using AutoMapper;

	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.ViewModels;
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Model;
	using Crm.Services.Interfaces;
	using Crm.VisitReport.Model;

	public class VisitReportResponseViewModel :  DynamicFormReferenceResponseViewModelBase, IResponseViewModel<VisitReport>
	{
		public VisitReportResponseViewModel(DynamicFormReference dynamicFormReference, IAppSettingsProvider appSettingsProvider, IMapper mapper, ISiteService siteService)
			: base(dynamicFormReference, appSettingsProvider, mapper, siteService)
		{
			DynamicFormReference = dynamicFormReference as VisitReport;
			ViewModel = "Crm.VisitReport.ViewModels.VisitReportDetailsModalViewModel";
		}
		public virtual VisitReport DynamicFormReference { get; set; }
		public virtual Company Company
		{
			get { return DynamicFormReference?.Company; }
		}
		public virtual Visit Visit
		{
			get { return DynamicFormReference?.Visit; }
		}
		public virtual Address VisitAddress
		{
			get { return DynamicFormReference?.Visit?.Address; }
		}
		public virtual User ResponsibleUser
		{
			get { return DynamicFormReference?.ResponsibleUserObject; }
		}
	}
}
