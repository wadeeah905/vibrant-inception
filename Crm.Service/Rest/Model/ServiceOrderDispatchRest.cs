namespace Crm.Service.Rest.Model
{
	using System;
	using System.Xml.Serialization;

	using Crm.Library.Api.Attributes;
	using Crm.Library.BaseModel;
	using Crm.Library.Rest;
	using Crm.Library.Rest.Interfaces;
	using Crm.Rest.Model;
	using Crm.Service.Model;

	[RestTypeFor(DomainType = typeof(ServiceOrderDispatch))]
	[XmlRoot("service-order-dispatch")]
	public class ServiceOrderDispatchRest : RestEntity, IRestEntityWithExtensionValues
	{
		public virtual SerializableDictionary<string, object> ExtensionValues { get; set; }
		public string DispatchNo { get; set; }
		[XmlElement("id")]
		public Guid Id { get; set; }
		[XmlElement("username")]
		public string Username { get; set; }
		[XmlElement("date")]
		public DateTime Date { get; set; }
		[XmlElement("time")]
		public DateTime Time { get; set; }
		[NotReceived] public virtual DateTime StartTime { get; set; }
		[XmlElement("is-fixed")]
		public bool IsFixed { get; set; }
		[XmlElement("duration")]
		[RestrictedField] public TimeSpan Duration { get; set; }
		[XmlElement("status-key")]
		public string StatusKey { get; set; }
		[XmlElement("remark", IsNullable = true)]
		public string Remark { get; set; }
		public string RequiredOperations { get; set; }
		public string Diagnosis { get; set; }
		[ExplicitExpand, NotReceived, XmlIgnore] public UserRest DispatchedUser { get; set; }
		public virtual double? LatitudeOnDispatchStart { get; set; }
		public virtual double? LongitudeOnDispatchStart { get; set; }
		public string SignatureContactName { get; set; }
		public string SignatureJson { get; set; }
		public DateTime? SignatureDate { get; set; }
		public bool SignPrivacyPolicyAccepted { get; set; }
		public string SignatureTechnicianName { get; set; }
		public string SignatureTechnicianJson { get; set; }
		public DateTime? SignatureTechnicianDate { get; set; }
		public string SignatureOriginatorName { get; set; }
		public string SignatureOriginatorJson { get; set; }
		public DateTime? SignatureOriginatorDate { get; set; }
		public bool FollowUpServiceOrder { get; set; }
		public string FollowUpServiceOrderRemark { get; set; }
		public string RejectReasonKey { get; set; }
		public string RejectRemark { get; set; }
		public string ComponentKey { get; set; }
		public string CauseOfFailureKey { get; set; }
		public string ErrorCodeKey { get; set; }
		[XmlElement("order-id")]
		public Guid OrderId { get; set; }
		[RestrictedField]
		[XmlElement("order-no")]
		public string OrderNo { get; set; }
		[ExplicitExpand, NotReceived, XmlIgnore] public ServiceOrderHeadRest ServiceOrder { get; set; }
		public Guid? CurrentServiceOrderTimeId { get; set; }
		[ExplicitExpand, NotReceived, XmlIgnore] public ServiceOrderTimeRest CurrentServiceOrderTime { get; set; }
		[ExplicitExpand, NotReceived, XmlIgnore] public ServiceOrderDispatchReportRecipientRest[] ReportRecipients { get; set; }
		[ExplicitExpand, NotReceived, XmlIgnore] public ServiceOrderMaterialRest[] ServiceOrderMaterial { get; set; }
		[ExplicitExpand, NotReceived, XmlIgnore] public ServiceOrderTimePostingRest[] ServiceOrderTimePostings { get; set; }
	}
}
