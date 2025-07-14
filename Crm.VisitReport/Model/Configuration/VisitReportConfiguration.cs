namespace Crm.VisitReport.Model.Configuration
{
    using Crm.DynamicForms.Model;
    using Crm.Library.EntityConfiguration;

    public class VisitReportConfiguration : EntityConfiguration<VisitReport>
	{
		public override void Initialize()
		{
			Property(x => x.DynamicFormKey,  
			m => m.Filterable(f => f.Definition(
			new AutoCompleterFilterDefinition<DynamicForm>(null,null,
			"CrmDynamicForms_DynamicForm",
			"Helper.DynamicForm.getTitle", x => x.Id,
			filterFunction: "Helper.DynamicForm.getDynamicFormVisitReportFilter",
			joins: "[{ Selector: 'Localizations', Operation: 'filter(function(x) { return x.DynamicFormElementId == null })' }, 'Languages']" ) 
			{ Caption = "Title" })));
			NestedProperty(x => x.Visit.VisitAim, m => m.Filterable());
			Property(x => x.CreateDate, m => m.Filterable(f => f.Definition(new DateFilterDefinition { AllowPastDates = true, AllowFutureDates = false })));
			Property(x => x.CreateUser, m => m.Filterable(f => f.Definition(new UserFilterDefinition())));
			Property(x => x.ResponsibleUser, m => m.Filterable(f => f.Definition(new UserFilterDefinition())));
			Property(x => x.Completed, m => m.Filterable());
		}
		public VisitReportConfiguration(IEntityConfigurationHolder<VisitReport> entityConfigurationHolder)
			: base(entityConfigurationHolder)
		{
		}
	}
}
