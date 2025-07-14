namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;

	[RestTypeFor(DomainType = typeof(Service.Model.ReplenishmentOrder))]
	public class ReplenishmentOrderRest : RestEntityWithExtensionValues
	{
		public string ResponsibleUser { get; set; }
		public bool IsClosed { get; set; }
		public DateTime? CloseDate { get; set; }
		public string ClosedBy { get; set; }
		public bool IsExported { get; set; }
		[ExplicitExpand, NotReceived] public ReplenishmentOrderItemRest[] Items { get; set; }
		[ExplicitExpand, NotReceived] public UserRest ResponsibleUserObject { get; set; }
	}
}
