namespace Crm.Order.Model.Lookups
{
	using Crm.Library.Globalization.Lookup;

	[Lookup("[LU].[CalculationPositionType]")]
	public class CalculationPositionType : EntityLookup<string>
	{
		[LookupProperty(Shared = true)]
		public virtual bool HasPurchasePrice { get; set; }
		[LookupProperty(Shared = true)]
		public virtual bool IsAbsolute { get; set; }
		[LookupProperty(Shared = true)]
		public virtual bool IsDefault { get; set; }
		[LookupProperty(Shared = true)]
		public virtual bool IsDiscount { get; set; }
	}
}