namespace Crm.Service.Model.Lookup
{
	using Crm.Library.Api.Attributes;
	using Crm.Library.Globalization.Lookup;

	[Lookup("[SMS].[ErrorCode]")]
	public class ErrorCode : EntityLookup<string>
	{
		// Members
		public static readonly ErrorCode None = new ErrorCode { Key = null, Value = "None" };
		[RestrictedField]
		public virtual int ErrorCodeId { get; set; }
		[RestrictedField]
		public virtual string Description { get; set; }
		[RestrictedField]
		public virtual string Remark { get; set; }
		[RestrictedField]
		public virtual int Priority { get; set; }
		[RestrictedField]
		public virtual int? Component { get; set; }
		[RestrictedField]
		public virtual int? QualityPlanId { get; set; }
		[RestrictedField]
		public virtual int? BPChecklistId { get; set; }
		[RestrictedField]
		public virtual string MonitoringCode { get; set; }
		[RestrictedField]
		public virtual string InstallationType { get; set; }
		[RestrictedField]
		public virtual string RdsPpClassification { get; set; }
		[RestrictedField]
		public virtual string StandardAction { get; set; }
		[RestrictedField]
		public virtual int? StandardActionExecuteCount { get; set; }
		[RestrictedField]
		public virtual string StandardActionExecuteTimeout { get; set; }
		[RestrictedField]
		public virtual string TemplateOrderNo { get; set; }
		[RestrictedField]
		public virtual int? ReactionTime { get; set; }
		[RestrictedField]
		public virtual string ReactionTimeType { get; set; }
		[RestrictedField]
		public virtual string Code { get; set; }
		[RestrictedField]
		public virtual int CountOfNotifications { get; set; }
	}
}
