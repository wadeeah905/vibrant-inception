namespace Crm.Order.Model.Lookups
{
	using Crm.Library.Globalization.Lookup;

	[Lookup("[LU].[OrderStatus]", "StatusId")]
	public class OrderStatus : EntityLookup<string>, ILookupWithColor
	{
		//Common
		public const string OpenKey = "Open";
		
		//order only
		public const string ClosedKey = "Closed";

		//offer only
		public const string CanceledKey = "Canceled";
		public const string ExpiredKey = "Expired";
		public const string OrderCreatedKey = "OrderCreated";

		[LookupProperty(Shared = true)]
		public virtual string Color { get; set; }

		public OrderStatus()
		{
			Color = "#9E9E9E";
		}
	}
}