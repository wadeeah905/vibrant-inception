namespace Crm.Order.Rest.Model
{
	using System;

	using Crm.Library.BaseModel;
	using Crm.Library.Rest;
	using Crm.Order.Model;

	[RestTypeFor(DomainType = typeof(CalculationPosition))]
	public class CalculationPositionRest : RestEntity
	{
		public Guid BaseOrderId { get; set; }
		public SerializableDictionary<string, object> ExtensionValues { get; set; }
		public Guid Id { get; set; }
		public string LegacyId { get; set; }
		public string CalculationPositionTypeKey { get; set; }
		public bool IsExported { get; set; }
		public decimal PurchasePrice { get; set; }
		public string Remark { get; set; }
		public decimal SalesPrice { get; set; }
		public bool IsPercentage { get; set; }
	}
}