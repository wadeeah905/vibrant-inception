namespace Sms.Checklists.Model.Mappings
{
	using Crm.Library.BaseModel.Mappings;
	using Crm.Service.Model;

	using LMobile.Unicore.NHibernate;

	using NHibernate.Mapping.ByCode;
	using NHibernate.Mapping.ByCode.Conformist;

	public class ServiceOrderExtensionMapping : ComponentMapping<ServiceOrderExtension>, INHibernateMappingExtension<ServiceOrderHead, ServiceOrderExtension>
	{
		public ServiceOrderExtensionMapping()
		{
			this.EntitySet(x => x.ServiceOrderChecklists, map =>
			{
				map.Key(km => km.Column("ReferenceKey"));
				map.Fetch(CollectionFetchMode.Select);
				map.Lazy(CollectionLazy.Lazy);
				map.Cascade(Cascade.Persist);
				map.Inverse(true);
			}, action => action.OneToMany());
		}
	}
}