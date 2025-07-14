namespace Crm.Order.Model
{
	using Crm.Model;
    using System;

	using Crm.Order.Model.Lookups;

	public class Offer : BaseOrder
	{
		public virtual DateTime? ValidTo { get; set; }
		public virtual bool IsLocked { get; set; }
		public virtual string CancelReasonCategoryKey { get; set; }
		public virtual string CancelReasonText { get; set; }

		public virtual OrderCancelReasonCategory CancelReasonCategory
		{
			get { return CancelReasonCategoryKey != null ? LookupManager.Get<OrderCancelReasonCategory>(CancelReasonCategoryKey) : null; }
		}
		public Offer()
		{
		}
		public Offer(Company company, string responsibleUser)
			: base(company, responsibleUser)
		{
		}
	}
}