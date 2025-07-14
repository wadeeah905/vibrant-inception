namespace Sms.Checklists.Model.Configuration
{
	using Crm.Library.EntityConfiguration;

	public class ServiceOrderChecklistConfiguration : EntityConfiguration<ServiceOrderChecklist>
	{
		public override void Initialize()
		{
			Property(x => x.DynamicFormTitle, m => m.Filterable(f => f.Caption("Checklist")));
			Property(x => x.Completed, m => m.Filterable());
			Property(x => x.RequiredForServiceOrderCompletion, m => m.Filterable());
			Property(x => x.SendToCustomer, m => m.Filterable());
		}

		public ServiceOrderChecklistConfiguration(IEntityConfigurationHolder<ServiceOrderChecklist> entityConfigurationHolder)
			: base(entityConfigurationHolder)
		{
		}
	}
}
