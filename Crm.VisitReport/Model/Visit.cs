namespace Crm.VisitReport.Model
{
	using System;
	using System.Collections.Generic;
	using System.Collections.ObjectModel;

	using Crm.Library.Extensions;
	using Crm.Model;
	using Crm.VisitReport.Lookups;
	using Crm.VisitReport.Model.Relationships;

	public class Visit : Contact
	{
		public Visit()
		{
			ContactPersonRelationships = new List<ContactPersonRelationship>();
			Topics = new Collection<VisitTopic>();
			VisitReports = new List<VisitReport>();
		}

		public virtual Address Address { get; set; }
		public virtual Guid AddressId { get; set; }
		public virtual string ContactPerson { get; set; }
		public virtual ICollection<ContactPersonRelationship> ContactPersonRelationships { get; set; }
		public virtual string CustomAim { get; set; }
		public virtual string LastCreatedVisitReported { get; set; }
		public virtual DateTime? PlannedDate { get; set; }
		public virtual TimeSpan? PlannedDuration { get; set; }
		public virtual DateTime? PlannedEndDate { get; set; }
		public virtual DateTime? PlannedTime { get; set; }
		public override string ReferenceLink => ActualType != null && ParentName.IsNotNullOrEmpty()
			? $"{ResourceManager.Instance.GetTranslation(ActualType.Name)} {ResourceManager.Instance.GetTranslation("For")} {ParentName}"
			: ResourceManager.Instance.GetTranslation(ContactType);
		public virtual ICollection<VisitTopic> Topics { get; set; }
		public virtual VisitAim VisitAim => VisitAimKey != null ? LookupManager.Get<VisitAim>(VisitAimKey) : null;
		public virtual string VisitAimKey { get; set; }
		public virtual ICollection<VisitReport> VisitReports { get; set; }
		public virtual string StatusKey { get; set; }
		public virtual VisitStatus Status
		{
			get { return StatusKey != null ? LookupManager.Get<VisitStatus>(StatusKey) : null; }
		}
	}
}