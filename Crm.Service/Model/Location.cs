namespace Crm.Service.Model
{
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using Newtonsoft.Json;
	using System;

	public class Location : EntityBase<Guid>, ISoftDelete
	{
		public virtual string LocationNo { get; set; }

		public virtual Guid StoreId { get; set; }
		[JsonIgnore]
		public virtual Store Store { get; set; }
	}
}