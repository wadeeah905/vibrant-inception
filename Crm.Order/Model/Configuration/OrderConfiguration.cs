namespace Crm.Order.Model.Configuration
{
	using Crm.Library.EntityConfiguration;
	using Crm.Model;

	public class OrderConfiguration : EntityConfiguration<Order>
	{
		public override void Initialize()
		{
			// Sortable properties
			Property(x => x.Price, c => c.Sortable());
			Property(x => x.CreateDate, c => c.Sortable());
			Property(x => x.OrderNo, c =>
			{
				c.Sortable(x => x.SortCaption("OrderNumber"));
				c.Filterable(x => x.Caption("OrderNumber"));
			});
			Property(x => x.DocumentNo, c =>
			{
				c.Sortable();
				c.Filterable();
			});

			// Filterable properties
			Property(x => x.Status, c => c.Filterable());
			Property(x => x.ResponsibleUser, c => c.Filterable(f => f.Definition(new UserFilterDefinition { WithGroups = true })));
			Property(x => x.ContactPersonId, c => c.Filterable(f => f.Definition(new AutoCompleterFilterDefinition<Person>("PersonAutocomplete", new { Plugin = "Main" }, "Main_Person", x => x.Name, x => x.Id, x => x.Surname, x => x.Firstname) { Caption = "ContactPerson" })));
			Property(x => x.Representative, c => c.Filterable(f => f.Definition(new UserFilterDefinition { WithGroups = true })));
			Property(x => x.ContactId, m => m.Filterable(f => f.Definition(new AutoCompleterFilterDefinition<Company>("CompanyAutocomplete", new { Plugin = "Main" }, "Main_Company", "Helper.Company.getDisplayName", x => x.Id, x => x.LegacyId, x => x.Name) { ShowOnMaterialTab = false })));
			Property(x => x.ExportDate, c =>
			{
				c.Filterable(f => f.Definition(new DateFilterDefinition { AllowFutureDates = false }));
				c.Sortable();
			});

			Property(x => x.CustomerOrderNumber, c =>
			{
				c.Sortable();
				c.Filterable();
			});

			// Filterable and Sortable properties
			Property(x => x.OrderDate, c =>
			{
				c.Filterable(f => f.Definition(new DateFilterDefinition { AllowPastDates = true, AllowFutureDates = false }));
				c.Sortable();
			});
			Property(x => x.DeliveryDate, c =>
			{
				c.Filterable(f => f.Definition(new DateFilterDefinition { AllowPastDates = true, AllowFutureDates = true }));
				c.Sortable();
			});
			Property(x => x.PublicDescription, c => c.Filterable());
			Property(x => x.PrivateDescription, c => c.Filterable());
		}
		public OrderConfiguration(IEntityConfigurationHolder<Order> entityConfigurationHolder)
			: base(entityConfigurationHolder)
		{
		}
	}
}