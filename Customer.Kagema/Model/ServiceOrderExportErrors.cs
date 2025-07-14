
using Crm.Library.BaseModel.Interfaces;
using Crm.Library.BaseModel;
using System;
using Crm.Service.Model;

namespace Customer.Kagema.Model
{
	public class ServiceOrderExportErrors : EntityBase<Guid>, ISoftDelete
	{
		public virtual string OrderNo { get; set; }
		public virtual string ExportDetails { get; set; }
		public virtual Installation AffectedInstallation { get; set; }
		public virtual Guid? InstallationId { get; set; }
		[Obsolete("use " + nameof(AffectedInstallation) + "." + nameof(Installation.Description) + " instead")]
		public virtual string InstallationDescription { get; set; }


	}
}
