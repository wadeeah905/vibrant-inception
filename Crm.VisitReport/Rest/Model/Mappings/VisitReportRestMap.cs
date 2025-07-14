namespace Crm.VisitReport.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.Rest.Model;
	using Crm.Library.AutoMapper;
	using Crm.VisitReport.Model;

	public class VisitReportRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<VisitReport, VisitReportRest>()
				.IncludeBase<DynamicFormReference, DynamicFormReferenceRest>()
				.ForMember(d => d.ResponsibleUserUser, m => m.MapFrom(s => s.ResponsibleUserObject));
			mapper.CreateMap<VisitReportRest, VisitReport>()
				.IncludeBase<DynamicFormReferenceRest, DynamicFormReference>();
		}
	}
}
