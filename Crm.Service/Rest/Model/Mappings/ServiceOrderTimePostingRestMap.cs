namespace Crm.Service.Rest.Model.Mappings
{
	using System;

	using AutoMapper;

	using Crm.Article.Services.Interfaces;
	using Crm.Library.AutoMapper;
	using Crm.Library.Services.Interfaces;
	using Crm.PerDiem.Model;
	using Crm.PerDiem.Rest.Model;
	using Crm.Service.Model;

	public class ServiceOrderTimePostingRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<ServiceOrderTimePosting, ServiceOrderTimePostingRest>()
				.IncludeBase<TimeEntry, TimeEntryRest>()
				.ForMember(x => x.ServiceOrderTimeId, m => m.MapFrom(x => x.OrderTimesId))
				.ForMember(x => x.Break, m => m.MapFrom(x => x.BreakInMinutes.HasValue ? TimeSpan.FromMinutes(x.BreakInMinutes.Value) : (TimeSpan?)null))
				.ForMember(x => x.PlannedDuration, m =>
				{
					m.PreCondition(x => x.PlannedDurationInMinutes is not null);
					m.MapFrom(x => TimeSpan.FromMinutes(x.PlannedDurationInMinutes.Value));
				})
				.ForMember(x => x.Username, m => m.MapFrom(x => x.UserUsername))
				.ForMember(x => x.ServiceOrderTime, m =>
				{
					m.MapFrom(s => s.ServiceOrderTime);
					m.MapAtRuntime();
				})
				.ForMember(x => x.ServiceOrder, m =>
				{
					m.MapFrom(s => s.ServiceOrderHead);
					m.MapAtRuntime();
				});

			mapper.CreateMap<ServiceOrderTimePostingRest, ServiceOrderTimePosting>()
				.IncludeBase<TimeEntryRest, TimeEntry>()
				.ForMember(x => x.BreakInMinutes, m => m.MapFrom(x => x.Break.HasValue ? (int)x.Break.Value.TotalMinutes : (int?)null))
				.ForMember(x => x.PlannedDurationInMinutes, m =>
				{
					m.PreCondition(x => x.PlannedDuration is not null);
					m.MapFrom(x => x.PlannedDuration.Value.TotalMinutes);
				})
				.ForMember(x => x.UserUsername, m => m.MapFrom(x => x.Username))
				.ForMember(x => x.ResponsibleUser, m => m.MapFrom(x => x.Username))
				.ForMember(x => x.UserId, m => m.MapFrom((src, _, _, ctx) => src.Username is null ? null : ctx.GetService<IUserService>().GetUser(src.Username)?.UserId))
				.ForMember(x => x.User, m => m.MapFrom((src, _, _, ctx) => src.Username is null ? null : ctx.GetService<IUserService>().GetUser(src.Username)))
				.ForMember(x => x.Price, m => m.MapFrom((source, destination, member, context) => source.ItemNo != null ? context.GetService<IArticleService>().GetArticleByItemNo(source.ItemNo)?.Price : null))
				.ForMember(x => x.OrderTimesId, m => m.MapFrom(x => x.ServiceOrderTimeId));
		}
	}
}
