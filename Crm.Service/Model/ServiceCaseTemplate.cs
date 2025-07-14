namespace Crm.Service.Model
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Model;
	using Crm.Library.Model.Lookup;

	public class ServiceCaseTemplate : EntityBase<Guid>, ISoftDelete
	{
		public virtual string CategoryKey { get; set; }
		public virtual string Name { get; set; }
		public virtual string PriorityKey { get; set; }
		public virtual string ResponsibleUser { get; set; }
		public virtual User ResponsibleUserObject { get; set; }
		public virtual ICollection<string> RequiredSkillKeys { get; set; }

		public virtual List<Skill> RequiredSkills
		{
			get { return RequiredSkillKeys == null ? null : RequiredSkillKeys.Select(key => LookupManager.Get<Skill>(key)).ToList(); }
		}
	}
}