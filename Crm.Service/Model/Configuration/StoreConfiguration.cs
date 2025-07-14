namespace Crm.Service.Model.Configuration
{
	using Crm.Library.EntityConfiguration;

	public class StoreConfiguration : EntityConfiguration<Store>
	{
		public StoreConfiguration(IEntityConfigurationHolder<Store> entityConfigurationHolder)
			: base(entityConfigurationHolder)
		{
		}
		public override void Initialize()
		{
			Property(x => x.Name, m =>
			{
				m.Filterable();
				m.Sortable();
			});
			Property(x => x.StoreNo, m =>
			{
				m.Filterable();
				m.Sortable();
			});
			Property(x => x.ModifyDate, m => m.Sortable());
			Property(x => x.CreateDate, m =>
			{
				m.Sortable();
				m.Filterable(f => f.Definition(new DateFilterDefinition { AllowFutureDates = false, AllowPastDates = true }));
			});
		}
	}
}