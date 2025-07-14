using Crm.Library.BaseModel;
using Crm.Service.Model;

namespace Customer.Kagema.Model.Extensions
{
    public class ServiceOrderMaterialExtensions : EntityExtension<ServiceOrderMaterial>
	{
		public virtual bool Calculate { get; set; }
		public virtual bool OnReport { get; set; }
		public virtual int iPosNo { get; set; }
	    public virtual string DisplayDescription { get; set; }
	}
}
