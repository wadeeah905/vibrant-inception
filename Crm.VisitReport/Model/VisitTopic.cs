namespace Crm.VisitReport.Model
{
	using System;

	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;

	public class VisitTopic : EntityBase<Guid>, ISoftDelete
	{
		public virtual string Description { get; set; }
		public virtual int Position { get; set; }
		public virtual string Topic { get; set; }
		public virtual Visit Visit { get; set; }
		public virtual Guid VisitKey { get; set; }
	}
}
