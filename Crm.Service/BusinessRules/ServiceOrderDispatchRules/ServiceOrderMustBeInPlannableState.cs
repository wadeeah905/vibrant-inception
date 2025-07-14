namespace Crm.Service.BusinessRules.ServiceOrderDispatchRules
{
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Validation;
	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;

	public class ServiceOrderMustBeInPlannableState : Rule<ServiceOrderDispatch>
	{
		private readonly ILookupManager lookupManager;
		public ServiceOrderMustBeInPlannableState(ILookupManager lookupManager)
			: base(RuleClass.Undefined)
		{
			this.lookupManager = lookupManager;
		}
		protected override RuleViolation CreateRuleViolation(ServiceOrderDispatch entity) => new RuleViolation(nameof(ServiceOrderMustBeInPlannableState));
		public override string GetTranslatedErrorMessage(IResourceManager resourceManager) => resourceManager.GetTranslation(nameof(ServiceOrderMustBeInPlannableState));
		public override bool IsSatisfiedBy(ServiceOrderDispatch entity)
		{
			if (entity.OrderHead == null)
			{
				return false;
			}
			var status = lookupManager.Get<ServiceOrderStatus>(entity.OrderHead.StatusKey);
			return status.BelongsToScheduling() || status.BelongsToInProgress();
		}
	}
}