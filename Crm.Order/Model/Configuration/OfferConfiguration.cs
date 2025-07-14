namespace Crm.Order.Model.Configuration
{
	using Crm.Library.EntityConfiguration;
	using Crm.Model;

	public class OfferConfiguration : EntityConfiguration<Offer>
	{
		public override void Initialize()
		{
			Property(x => x.CreateDate, c => c.Sortable());
			Property(x => x.Price, c => c.Sortable());
			Property(x => x.Id, c => c.Sortable());
			Property(x => x.ContactId, c => c.Sortable());

			Property(x => x.OrderNo, c =>
			{
				c.Sortable(s => s.SortCaption("CustomerOfferNumber"));
				c.Filterable(f => f.Caption("CustomerOfferNumber"));
			});
			Property(x => x.Status, c => c.Filterable());
			Property(x => x.ResponsibleUser, c => c.Filterable(f => f.Definition(new UserFilterDefinition { WithGroups = true })));
			Property(x => x.ContactPersonId, c => c.Filterable(f => f.Definition(new AutoCompleterFilterDefinition<Person>("PersonAutocomplete", new { Plugin = "Main" }, "Main_Person", x => x.Name, x => x.Id, x => x.Surname, x => x.Firstname) { Caption = "ContactPerson" })));
			Property(x => x.Representative, c => c.Filterable(f => f.Definition(new UserFilterDefinition { WithGroups = true })));
			Property(x => x.ContactId, m => m.Filterable(f => f.Definition(new AutoCompleterFilterDefinition<Company>("CompanyAutocomplete", new { Plugin = "Main" }, "Main_Company", "Helper.Company.getDisplayName", x => x.Id, x => x.LegacyId, x => x.Name) { ShowOnMaterialTab = false })));

			Property(x => x.ValidTo, c => c.Filterable(f => f.Definition(new DateFilterDefinition { AllowFutureDates = true, AllowPastDates = true })));
			Property(x => x.OrderDate, c =>
			{
				c.Filterable(f => f.Definition(new DateFilterDefinition { AllowPastDates = true, AllowFutureDates = false, Caption = "OfferDate" }));
				c.Sortable(s => s.SortCaption("OfferDate"));
			});

			Property(x => x.ExportDate, c =>
			{
				c.Filterable(f => f.Definition(new DateFilterDefinition { AllowFutureDates = false }));
				c.Sortable();
			});
			Property(x => x.PublicDescription, c => c.Filterable());
			Property(x => x.PrivateDescription, c => c.Filterable());
		}
		public OfferConfiguration(IEntityConfigurationHolder<Offer> entityConfigurationHolder)
			: base(entityConfigurationHolder)
		{
		}
	}
}
