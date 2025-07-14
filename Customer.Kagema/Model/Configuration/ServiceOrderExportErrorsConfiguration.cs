using Crm.Library.EntityConfiguration;



namespace Customer.Kagema.Model.Configuration
{
	public class ServiceOrderExportErrorsConfiguration : EntityConfiguration<ServiceOrderExportErrors>
	{
		public override void Initialize()
		{
			//Filterable properties
			Property(x => x.OrderNo, f => f.Filterable());

		}

		public ServiceOrderExportErrorsConfiguration(IEntityConfigurationHolder<ServiceOrderExportErrors> entityConfigurationHolder)
			: base(entityConfigurationHolder)
		{
		}
	}
}
