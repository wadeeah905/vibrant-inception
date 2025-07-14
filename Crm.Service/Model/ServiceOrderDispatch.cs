namespace Crm.Service.Model
{
	using System;
	using System.Collections.Generic;

	using Crm.Helpers;
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Model;
	using Crm.Library.Validation.Attributes;
	using Crm.Service.Model.Lookup;

	public class ServiceOrderDispatch : EntityBase<Guid>, ISoftDelete
	{
		public virtual string DispatchNo { get; set; }
		public virtual Guid OrderId { get; set; }
		public virtual ServiceOrderHead OrderHead { get; set; }

		public virtual string CalendarDescription
		{
			get { return OrderHead != null && DispatchedUser != null ? OrderHead.OrderNo + " - " + DispatchedUser.DisplayName : String.Empty; }
		}
		public virtual string CalenderBodyText
		{
			get
			{
				var tokens = new List<string>();

				if (OrderHead.CustomerContact != null)
				{
					tokens.Add(String.Format("{0}: {1}", ResourceManager.Instance.GetTranslation("Customer"), OrderHead.CustomerContact.Name));
				}
				if (!string.IsNullOrWhiteSpace(OrderHead.AffectedInstallation?.InstallationNo))
				{
					tokens.Add(String.Format("{0}: {1}", ResourceManager.Instance.GetTranslation("Installation"), OrderHead.AffectedInstallation?.InstallationNo));
				}
				if (DispatchedUser != null)
				{
					tokens.Add(String.Format("{0}: {1}", ResourceManager.Instance.GetTranslation("Technician"), DispatchedUser.DisplayName));
				}

				tokens.Add(String.Format("{0}: {1} {2}", ResourceManager.Instance.GetTranslation("Date"), Date.ToShortDateString(), Time.ToLocalTime().TimeOfDay));

				return String.Join(Environment.NewLine, tokens);
			}
		}

		public virtual Guid? CurrentServiceOrderTimeId { get; set; }
		public virtual ServiceOrderTime CurrentServiceOrderTime { get; set; }
		public virtual DateTime StartTime { get; set; }
		public virtual DateTime Date { get; set; }
		[DayRestriction]
		public virtual DateTime Time { get; set; }
		public virtual int DurationInMinutes { get; set; }
		public virtual bool IsFixed { get; set; }
		public virtual string Remark { get; set; }
		public virtual string RequiredOperations { get; set; }
		public virtual bool FollowUpServiceOrder { get; set; }
		public virtual string FollowUpServiceOrderRemark { get; set; }
		public virtual string Diagnosis { get; set; }
		public virtual double? LatitudeOnDispatchStart { get; set; }
		public virtual double? LongitudeOnDispatchStart { get; set; }
		public virtual string ReportSendingError { get; set; }
		public virtual bool ReportSent { get; set; }
		public virtual bool ReportSaved { get; set; }
		public virtual string ReportSavingError { get; set; }

		public virtual string ComponentKey { get; set; }
		public virtual Component Component
		{
			get { return ComponentKey != null ? LookupManager.Get<Component>(ComponentKey) : null; }
		}
		public virtual string CauseOfFailureKey { get; set; }
		public virtual CauseOfFailure CauseOfFailure
		{
			get { return CauseOfFailureKey != null ? LookupManager.Get<CauseOfFailure>(CauseOfFailureKey) : null; }
		}
		public virtual string ErrorCodeKey { get; set; }
		public virtual ErrorCode ErrorCode
		{
			get { return ErrorCodeKey != null ? LookupManager.Get<ErrorCode>(ErrorCodeKey) : null; }
		}
		public virtual string StatusKey { get; set; }
		public virtual ServiceOrderDispatchStatus Status
		{
			get { return StatusKey != null ? LookupManager.Get<ServiceOrderDispatchStatus>(StatusKey) : null; }
		}

		public virtual string RejectReasonKey { get; set; }
		public virtual ServiceOrderDispatchRejectReason RejectReason
		{
			get { return RejectReasonKey != null ? LookupManager.Get<ServiceOrderDispatchRejectReason>(RejectReasonKey) : null; }
		}
		public virtual string RejectRemark { get; set; }

		public virtual string DispatchedUsername { get; set; }
		public virtual User DispatchedUser { get; set; }

		public virtual IList<User> Users { get; set; }

		public virtual string SignatureContactName { get; set; }
		public virtual string SignatureJson { get; set; }
		public virtual DateTime? SignatureDate { get; set; }
		public virtual bool SignPrivacyPolicyAccepted { get; set; }

		public virtual string SignatureTechnicianName { get; set; }
		public virtual string SignatureTechnicianJson { get; set; }
		public virtual DateTime? SignatureTechnicianDate { get; set; }

		public virtual string SignatureOriginatorName { get; set; }
		public virtual string SignatureOriginatorJson { get; set; }
		public virtual DateTime? SignatureOriginatorDate { get; set; }

		public virtual int? SignatureWidth
		{
			get { return IsSignedByCustomer ? (int?)SignatureToImage.GetSignatureWidth(SignatureJson) : null; }
		}
		public virtual int? SignatureHeight
		{
			get { return IsSignedByCustomer ? (int?)SignatureToImage.GetSignatureHeight(SignatureJson) : null; }
		}
		public virtual bool IsSignedByCustomer
		{
			get { return !String.IsNullOrEmpty(SignatureJson); }
		}
		public virtual byte[] SignatureByteArray
		{
			get { return IsSignedByCustomer ? SignatureToImage.SigJsonToByteArray(SignatureJson) : null; }
		}
		public virtual ICollection<ServiceOrderDispatchReportRecipient> ReportRecipients { get; set; }
		public virtual ICollection<ServiceOrderTimePosting> TimePostings { get; set; }
		public virtual ICollection<ServiceOrderMaterial> ServiceOrderMaterial { get; set; }

		public ServiceOrderDispatch()
		{
			ReportRecipients = new List<ServiceOrderDispatchReportRecipient>();
			TimePostings = new List<ServiceOrderTimePosting>();
			ServiceOrderMaterial = new List<ServiceOrderMaterial>();
		}
	}
}