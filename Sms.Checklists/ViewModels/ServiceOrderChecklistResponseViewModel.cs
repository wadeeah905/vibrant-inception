namespace Sms.Checklists.ViewModels
{
	using AutoMapper;

	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.ViewModels;
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Model;
	using Crm.Service;
	using Crm.Service.Model;
	using Crm.Services.Interfaces;

	using Sms.Checklists.Model;
	using Sms.Checklists.Model.Extensions;

	public class ServiceOrderChecklistResponseViewModel : DynamicFormReferenceResponseViewModelBase, IResponseViewModel<ServiceOrderChecklist>
	{
		public ServiceOrderChecklistResponseViewModel(DynamicFormReference dynamicFormReference, IAppSettingsProvider appSettingsProvider, IMapper mapper, ISiteService siteService)
			: base(dynamicFormReference, appSettingsProvider, mapper, siteService)
		{
			DynamicFormReference = dynamicFormReference as ServiceOrderChecklist;
			ViewModel = "Sms.Checklists.ViewModels.ServiceOrderChecklistDetailsViewModel";
			MaintenanceOrderGenerationMode = appSettingsProvider.GetValue(ServicePlugin.Settings.ServiceContract.MaintenanceOrderGenerationMode).ToString();
		}
		public virtual ServiceOrderChecklist DynamicFormReference { get; set; }
		public virtual ServiceOrderHead ServiceOrder
		{
			get { return DynamicFormReference != null ? DynamicFormReference.ServiceOrder : null; }
		}
		public virtual User ServiceOrderResponsibleUser
		{
			get { return ServiceOrder != null ? ServiceOrder.ResponsibleUserObject : null; }
		}
		public virtual Installation Installation
				{
			get { return DynamicFormReference != null ? DynamicFormReference.GetInstallation() : null; }
		}
		public virtual Contact CustomerContact
		{
			get { return ServiceOrder != null && ServiceOrder.CustomerContact != null ? ServiceOrder.CustomerContact.Self : null; }
		}
		public virtual ServiceOrderDispatch Dispatch
		{
			get { return DynamicFormReference != null ? DynamicFormReference.Dispatch : null; }
		}
		public virtual string MaintenanceOrderGenerationMode { get; set; }
	}
}
