namespace Sms.Checklists.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.Rest.Model;
	using Crm.Library.AutoMapper;

	using Sms.Checklists.Model;

	public class ServiceCaseChecklistRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<ServiceCaseChecklist, ServiceCaseChecklistRest>()
				.IncludeBase<DynamicFormReference, DynamicFormReferenceRest>()
				.ForAllMembers(m => m.MapAtRuntime());
			mapper.CreateMap<ServiceCaseChecklistRest, ServiceCaseChecklist>()
				.IncludeBase<DynamicFormReferenceRest, DynamicFormReference>();
		}
	}
}
