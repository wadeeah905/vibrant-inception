namespace Crm.Service.Model
{
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Attributes;
	using Crm.Library.Model;

	public class UserExtension : EntityExtension<User>
	{
		[LookupKey]
		public virtual string DefaultStoreNo { get; set; }
		[LookupKey]
		public virtual string DefaultLocationNo { get; set; }
	}
}