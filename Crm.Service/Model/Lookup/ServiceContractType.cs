namespace Crm.Service.Model.Lookup
{
	using Crm.Library.Globalization.Lookup;

	[Lookup("[SMS].[ServiceContractType]")]
	public class ServiceContractType : EntityLookup<string>, ILookupWithColor
	{
		[LookupProperty(Shared = true)]
		public virtual string Color { get; set; }

		public const string UnknownKey = "0";

		// Constructor
		public ServiceContractType()
		{
			Color = "#AAAAAA";
		}
	}
}