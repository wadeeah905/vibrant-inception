using Microsoft.AspNetCore.Mvc;

namespace Sms.Checklists.Rest.Controllers
{
	using System;
	using System.Linq;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Rest;

	using Sms.Checklists.Model;

	public class ChecklistInstallationTypeRelationshipRestController : RestController<ChecklistInstallationTypeRelationship>
	{
		private readonly IRepositoryWithTypedId<ChecklistInstallationTypeRelationship, Guid> checklistInstallationTypeRelationshipRepository;

		public ChecklistInstallationTypeRelationshipRestController(IRepositoryWithTypedId<ChecklistInstallationTypeRelationship, Guid> checklistInstallationTypeRelationshipRepository, RestTypeProvider restTypeProvider)
			: base(restTypeProvider)
		{
			this.checklistInstallationTypeRelationshipRepository = checklistInstallationTypeRelationshipRepository;
		}

		public virtual ActionResult GetRelationships(Guid id)
		{
			var relationships = checklistInstallationTypeRelationshipRepository.GetAll().Where(x => x.DynamicFormKey == id);
			return Rest(relationships.ToArray());
		}
		public virtual ActionResult Delete(Guid id)
		{
			var relationship = checklistInstallationTypeRelationshipRepository.Get(id);
			if (relationship != null)
			{
				checklistInstallationTypeRelationshipRepository.Delete(relationship);
			}
			return Rest(true);
		}
		public virtual ActionResult Save(ChecklistInstallationTypeRelationship relationship)
		{
			checklistInstallationTypeRelationshipRepository.SaveOrUpdate(relationship);
			return Rest(relationship);
		}
	}
}
