namespace Crm.VisitReport.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.Library.AutoMapper;
	using Crm.Library.EntityConfiguration;
	using Crm.VisitReport.Model;

	public class VisitMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<Visit, TimelineEvent>()
				.ForMember(x => x.Id, m => m.MapFrom(x => x.Id))
				.ForMember(x => x.Summary, m => m.MapFrom(x => GetIcsSummary(x)))
				.ForMember(x => x.Description, m => m.MapFrom(x => x.Name))
				.ForMember(x => x.IsAllDay, m => m.MapFrom(x => false))
				.ForMember(x => x.Start, m => m.MapFrom(x => x.PlannedDate))
				.ForMember(x => x.End, m => m.MapFrom(x => x.PlannedEndDate))
				.ForMember(x => x.Location, m => m.MapFrom(x => x.Address.ToString()))
				;
		}
		protected virtual string GetIcsSummary(Visit visit)
		{
			var summary = visit.ParentName;
			if (visit.CustomAim != null)
			{
				summary += $" ({visit.CustomAim})";
			}
			else if (visit.VisitAim != null)
			{
				summary += $" ({visit.VisitAim.Value})";
			}

			return summary;
		}
	}
}
