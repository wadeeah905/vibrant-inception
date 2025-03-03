namespace Sms.Scheduler.Model
{
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using System;

	public class DispatchArticleAssignment : EntityBase<Guid>, ISoftDelete
	{
		public virtual Guid DispatchKey { get; set; }
		public virtual Guid ResourceKey { get; set; }
	}
}
