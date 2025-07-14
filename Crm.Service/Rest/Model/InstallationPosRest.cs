namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Article.Rest.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Service.Model;

	[RestTypeFor(DomainType = typeof(InstallationPos))]
	public class InstallationPosRest : RestEntityWithExtensionValues
	{
		public Guid? ArticleId { get; set; }
		public Guid? RelatedInstallationId { get; set; }
		public string Comment { get; set; }
		public string Description { get; set; }
		public int GroupLevel { get; set; }
		public Guid InstallationId { get; set; }
		public DateTime? InstallDate { get; set; }
		public bool IsGroupItem { get; set; }
		public bool IsInstalled { get; set; }
		public string ItemNo { get; set; }
		public string LegacyInstallationId { get; set; }
		public string PosNo { get; set; }
		public string RdsPpClassification { get; set; }
		public Guid? ReferenceId { get; set; }
		public DateTime? RemoveDate { get; set; }
		public float Quantity { get; set; }
		public string QuantityUnitKey { get; set; }
		public DateTime? WarrantyEndCustomer { get; set; }
		public DateTime? WarrantyEndSupplier { get; set; }
		public DateTime? WarrantyStartCustomer { get; set; }
		public DateTime? WarrantyStartSupplier { get; set; }
		public string BatchNo { get; set; }
		public string SerialNo { get; set; }
		public bool IsSerial { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public ArticleRest Article { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public InstallationPosRest[] Children { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public InstallationRest Installation { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public InstallationRest RelatedInstallation { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public InstallationPosRest Parent { get; set; }
	}
}
