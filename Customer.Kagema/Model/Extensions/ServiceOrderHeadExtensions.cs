using Crm.Library.BaseModel;
using Crm.Service.Model;

namespace Customer.Kagema.Model.Extensions
{
	public class ServiceOrderHeadExtensions : EntityExtension<ServiceOrderHead>
	{
		public virtual bool ExportServiceOrder { get; set; }
		public virtual string ExportDetails { get; set; }
		public virtual string LMStatus { get; set; }
		public virtual string SalespersonName { get; set; }
		public virtual bool ExportNewServiceOrder { get; set; }
		public virtual string Remark { get; set; }
		public virtual bool TravelFlateRate { get; set; }
		public virtual bool OfferFlateRate { get; set; }
		public virtual bool AttachChecklist { get; set; }
		public virtual int? FailedExportRetries { get; set; }
		public virtual bool Tag13B { get; set; }

	}
}
