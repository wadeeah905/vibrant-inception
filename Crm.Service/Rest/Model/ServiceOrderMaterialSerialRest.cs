namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Library.Rest;
	using Crm.Service.Model;

	[RestTypeFor(DomainType = typeof(ServiceOrderMaterialSerial))]
	public class ServiceOrderMaterialSerialRest : RestEntityWithExtensionValues
	{
		public Guid OrderMaterialId { get; set; }
		public string SerialNo { get; set; }
		public string PreviousSerialNo { get; set; }
		public bool IsInstalled { get; set; }
		public string NoPreviousSerialNoReasonKey { get; set; }
	}
}