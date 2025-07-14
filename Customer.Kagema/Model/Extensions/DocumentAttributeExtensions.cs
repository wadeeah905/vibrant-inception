namespace Customer.Kagema.Model.Extensions
{
	using Crm.Library.BaseModel;
	using Crm.Model;
	using Crm.Service.Model;

	public class DocumentAttributeExtensions : EntityExtension<DocumentAttribute>
	{
		public virtual bool SendToInternalSales { get; set; }
		public virtual bool SendToCustomer { get; set; }
		
	}
}
