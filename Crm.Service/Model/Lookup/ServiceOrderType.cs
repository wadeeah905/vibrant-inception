namespace Crm.Service.Model.Lookup
{
	using Crm.Library.Globalization.Lookup;

	[Lookup("[SMS].[ServiceOrderType]", "ServiceOrderType")]
	public class ServiceOrderType : EntityLookup<string>, ILookupWithColor
	{
		[LookupProperty(Shared = true)]
		public virtual string Color { get; set; } = "#9E9E9E";
		[LookupProperty(Shared = true)]
		public virtual string NumberingSequence { get; set; }
		[LookupProperty(Shared = true)]
		public virtual bool MaintenanceOrder { get; set; }
		[LookupProperty(Shared = true)]
		public virtual bool ShowInMobileClient { get; set; }

		public ServiceOrderType()
		{
			NumberingSequence = "SMS.ServiceOrderHead.ServiceOrder";
		}
	}

	// Extension methods
	public static class ServiceOrderTypeExtensions
	{
		public static bool IsMaintenance(this ServiceOrderType serviceOrderType)
		{
			return serviceOrderType.MaintenanceOrder;
		}
	}
}
