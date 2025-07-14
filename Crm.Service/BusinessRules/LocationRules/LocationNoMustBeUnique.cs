namespace Crm.Service.BusinessRules.LocationRules
{
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Validation;
	using Crm.Service.Model;
	using System;
	using System.Linq;

	public class LocationNoMustBeUnique : Rule<Location>
	{
		private readonly IRepositoryWithTypedId<Location, Guid> locationRepository;

		protected override bool IsIgnoredFor(Location location)
		{
			return location.LocationNo.IsNullOrEmpty();
		}

		public override bool IsSatisfiedBy(Location location)
		{
			return !locationRepository.GetAll().Any(x => x.LocationNo == location.LocationNo && x.Id != location.Id);
		}

		protected override RuleViolation CreateRuleViolation(Location location)
		{
			return RuleViolation(location, l => l.LocationNo);
		}

		public LocationNoMustBeUnique(IRepositoryWithTypedId<Location, Guid> locationRepository)
			: base(RuleClass.Unique)
		{
			this.locationRepository = locationRepository;
		}
	}
}
