namespace Crm.VisitReport.Model.Configuration
{
	using Crm.Library.EntityConfiguration;
	using Crm.Model;

	public class VisitConfiguration : EntityConfiguration<Visit>
	{
		public override void Initialize()
		{
			Property(x => x.PlannedDate, m =>
			{
				m.Filterable(f => f.Definition(new DateFilterDefinition { AllowPastDates = true, AllowFutureDates = true }));
				m.Sortable();
			});
			Property(x => x.ParentName, m => m.Sortable());
			Property(x => x.ParentId, m => m.Filterable(f => f.Definition(new AutoCompleterFilterDefinition<Company>("CompanyAutocomplete", new { Plugin = "Main" }, "Main_Company", x => x.Name, x => x.Id, x => x.LegacyId, x => x.Name) { ShowOnMaterialTab = false })));
			Property(x => x.Name, m => m.Filterable());
			Property(x => x.VisitAim, m => m.Filterable());
			Property(x => x.Status, m => m.Filterable());
			Property(x => x.StatusKey, m => m.Sortable());
			Property(x => x.CreateDate, m => m.Filterable(f => f.Definition(new DateFilterDefinition { AllowPastDates = true, AllowFutureDates = false })));
			Property(x => x.ResponsibleUser, m => m.Filterable(f => f.Definition(new UserFilterDefinition())));
			NestedProperty(x => x.Address.Street, m => m.Filterable());
			NestedProperty(x => x.Address.ZipCode, m => m.Filterable());
			NestedProperty(x => x.Address.City, m => m.Filterable());
			NestedProperty(x => x.Address.Latitude, c => c.Filterable(f => f.Definition(new GeoCoordinateFilterDefinition())));
			NestedProperty(x => x.Address.Longitude, c => c.Filterable(f => f.Definition(new GeoCoordinateFilterDefinition())));
		}
		public VisitConfiguration(IEntityConfigurationHolder<Visit> entityConfigurationHolder)
			: base(entityConfigurationHolder)
		{
		}
	}
}
