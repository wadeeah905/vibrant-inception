namespace Crm.Order.Model
{
	using System;

	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	
	public class CalculationPosition : EntityBase<Guid>, IExportable, ISoftDelete
	{
		public virtual Guid BaseOrderId { get; set; }
		public virtual BaseOrder BaseOrder { get; set; }
		public virtual string LegacyId { get; set; }
		public virtual string CalculationPositionTypeKey { get; set; }
		public virtual bool IsExported { get; set; }
		public virtual decimal PurchasePrice { get; set; }
		public virtual string Remark { get; set; }
		public virtual decimal SalesPrice { get; set; }
		public virtual bool IsPercentage { get; set; }
	}
}