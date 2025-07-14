namespace Sms.Checklists.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.Rest.Model;
	using Crm.Library.AutoMapper;

	using Sms.Checklists.Model;

	public class ServiceOrderChecklistRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<ServiceOrderChecklist, ServiceOrderChecklistRest>()
				.IncludeBase<DynamicFormReference, DynamicFormReferenceRest>()
				.ForMember(d => d.ServiceOrderTime, m =>
				{
					m.MapFrom(s => s.ServiceOrderTime);
					m.MapAtRuntime();
				})
				.ForMember(d => d.ServiceOrder, m =>
				{
					m.MapFrom(s => s.ServiceOrder);
					m.MapAtRuntime();
				});
			mapper.CreateMap<ServiceOrderChecklistRest, ServiceOrderChecklist>()
				.IncludeBase<DynamicFormReferenceRest, DynamicFormReference>();
		}
	}
}
