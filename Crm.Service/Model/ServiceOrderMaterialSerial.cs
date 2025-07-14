namespace Crm.Service.Model
{
	using System;

	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Service.Model.Lookup;

	public class ServiceOrderMaterialSerial : EntityBase<Guid>, ISoftDelete
	{
		public virtual Guid OrderMaterialId { get; set; }
		public virtual ServiceOrderMaterial ServiceOrderMaterial { get; set; }
		
		public virtual string SerialNo { get; set; }
		public virtual string PreviousSerialNo { get; set; }
		public virtual bool IsInstalled { get; set; }

		public virtual string NoPreviousSerialNoReasonKey { get; set; }
		public virtual NoPreviousSerialNoReason NoPreviousSerialNoReason { get { return NoPreviousSerialNoReasonKey != null ? LookupManager.Get<NoPreviousSerialNoReason>(NoPreviousSerialNoReasonKey) : null; } }
	}
}
