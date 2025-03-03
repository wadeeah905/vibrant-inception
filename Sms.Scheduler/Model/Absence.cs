namespace Sms.Scheduler.Model
{
	using System;

	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Extensions;
	using Crm.PerDiem.Model.Lookups;

	public class Absence : EntityBase<Guid>, ISoftDelete
	{
		public virtual string Description { get; set; }
		public virtual string TimeEntryTypeKey { get; set; }
		public virtual string ResponsibleUser { get; set; }
		public virtual DateTime From { get; set; } // From and To are intended to save the start and end time.
		public virtual DateTime To { get; set; }

		public virtual TimeEntryType TimeEntryType => TimeEntryTypeKey != null ? LookupManager.Get<TimeEntryType>(TimeEntryTypeKey) : null;

		// Some time entry types (e.g. a service order time entry) cannot be created ord edited via the time entry editor but they are taken from some other table. Since there is no
		// lookup value for these types (they must not be selectable from the lookup select box) the translation is taken from the resource file. For these types editing must always be
		// disabled.
		public virtual string TimeEntryTypeAsString => TimeEntryTypeKey.IsNotNullOrEmpty() ? TimeEntryType.Value : ResourceManager.Instance.GetTranslation(GetType().Name + "Type");
		public virtual string TimeEntryTypeAbbreviation => ResourceManager.Instance.GetTranslation(GetType().Name + "Abbreviation");
	}
}
