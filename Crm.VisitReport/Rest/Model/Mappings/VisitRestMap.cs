namespace Crm.VisitReport.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.Library.AutoMapper;
	using Crm.Model;
	using Crm.Rest.Model;
	using Crm.VisitReport.Model;

	public class VisitRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression Mapper)
		{
			Mapper.CreateMap<Visit, VisitRest>()
				.IncludeBase<Contact, ContactRest>()
				.ForMember(d => d.Parent, m => m.MapFromProxy(s => s.Parent).As<Company>())
				.ForMember(d => d.ResponsibleUserUser, m => m.MapFrom(s => s.ResponsibleUserObject));

			Mapper.CreateMap<Contact, VisitRest>();

			Mapper.CreateMap<VisitRest, Visit>()
				.IncludeBase<ContactRest, Contact>();
		}
	}
}
