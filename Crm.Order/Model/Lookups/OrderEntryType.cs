namespace Crm.Order.Model.Lookups
{
	using Crm.Library.Globalization.Lookup;

	[Lookup("[LU].[OrderEntryType]")]
	[NotEditable]
	public class OrderEntryType : EntityLookup<string>
	{
	}
}