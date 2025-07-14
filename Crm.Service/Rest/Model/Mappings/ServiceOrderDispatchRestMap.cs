namespace Crm.Service.Rest.Model.Mappings
{
	using System;

	using AutoMapper;

	using Crm.Library.AutoMapper;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Services.Interfaces;
	using Crm.Service.Model;

	public class ServiceOrderDispatchRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<ServiceOrderDispatch, ServiceOrderDispatchRest>()
				.ForMember(d => d.OrderNo, m => m.MapFrom(d => d.OrderHead.OrderNo))
				.ForMember(d => d.Username, m => m.MapFrom(d => d.DispatchedUsername))
				.ForMember(d => d.Duration, m => m.MapFrom(d => new TimeSpan(0, d.DurationInMinutes, 0)))
				.ForMember(d => d.ServiceOrder, m =>
				{
					m.MapFrom(s => s.OrderHead);
					m.MapAtRuntime();
				})
				.ForMember(d => d.CurrentServiceOrderTime, m =>
				{
					m.MapFrom(s => s.CurrentServiceOrderTime);
					m.MapAtRuntime();
				})
				.ForMember(d => d.ServiceOrderTimePostings, m => m.MapFrom(s => s.TimePostings));

			mapper.CreateMap<ServiceOrderDispatchRest, ServiceOrderDispatch>()
				.ForMember(d => d.DurationInMinutes, m => m.MapFrom(d => (int)d.Duration.TotalMinutes))
				.ForMember(d => d.DispatchedUsername, m => m.MapFrom(d => d.Username))
				.ForMember(d => d.StartTime, m => m.Ignore())
				//needed because of bad NH mapping and event handlers
				.ForMember(d => d.DispatchedUser, m => m.MapFrom((source, destination, member, context) => context.GetService<IUserService>().GetUser(source.Username)))
				.ForMember(d => d.OrderHead, m => m.MapFrom((source, destination, member, context) => context.GetService<IRepositoryWithTypedId<ServiceOrderHead, Guid>>().Get(source.OrderId)));
		}
	}
}
