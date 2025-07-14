namespace Crm.Order.Model
{
	using Crm.Library.BaseModel;
	using Crm.Library.Globalization.Lookup;
	using Crm.Model.Lookups;

	public class CompanyTypeExtension : EntityExtension<CompanyType>
	{
		[LookupProperty(Shared = true)]
		public bool CanHaveOrders { get; set; }
	}
}