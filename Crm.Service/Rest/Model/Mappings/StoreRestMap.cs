namespace Crm.Service.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.Library.AutoMapper;
	using Crm.Service.Model;

	public class StoreRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<Store, StoreRest>();
			mapper.CreateMap<StoreRest, Store>();
		}
	}
}
