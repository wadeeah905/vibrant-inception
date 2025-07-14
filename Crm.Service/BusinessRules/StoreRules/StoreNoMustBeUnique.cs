namespace Crm.Service.BusinessRules.StoreRules
{
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Validation;
	using Crm.Service.Model;
	using System;
	using System.Linq;

	public class StoreNoMustBeUnique : Rule<Store>
	{
		private readonly IRepositoryWithTypedId<Store, Guid> storeRepository;

		protected override bool IsIgnoredFor(Store store)
		{
			return store.StoreNo.IsNullOrEmpty();
		}

		public override bool IsSatisfiedBy(Store store)
		{
			return !storeRepository.GetAll().Any(x => x.StoreNo == store.StoreNo && x.Id != store.Id);
		}

		protected override RuleViolation CreateRuleViolation(Store store)
		{
			return RuleViolation(store, s => s.StoreNo);
		}

		public StoreNoMustBeUnique(IRepositoryWithTypedId<Store, Guid> storeRepository)
			: base(RuleClass.Unique)
		{
			this.storeRepository = storeRepository;
		}
	}
}
