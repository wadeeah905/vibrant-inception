namespace Sms.Checklists.Services
{
	using System;
	using System.Linq;
	using System.Reflection;

	using Crm.Library.Api.Controller;
	using Crm.Library.AutoFac;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Extensions;

	using Microsoft.AspNetCore.OData.Query;

	using Sms.Checklists.Model;

	public class ODataQueryCurrentServiceOrderTimeOrder : IODataQueryFunction, IDependency
	{
		protected static MethodInfo OrderByForChecklistInfo = typeof(ODataQueryCurrentServiceOrderTimeOrder)
			.GetMethod(nameof(OrderByForChecklist), BindingFlags.Instance | BindingFlags.NonPublic);
		protected virtual IQueryable<ServiceOrderChecklist> OrderByForChecklist(IQueryable<ServiceOrderChecklist> query, Guid? currentServiceOrderTimeId)
		{
			if (currentServiceOrderTimeId.HasValue && currentServiceOrderTimeId.Value != Guid.Empty)
			{
				query = query.OrderByDescending(x => x.ServiceOrderTimeKey == currentServiceOrderTimeId.Value);
			}
			return query.OrderByDescending(x => x.ServiceOrderTimeKey == null);
		}
		public virtual IQueryable<T> Apply<T, TRest>(ODataQueryOptions<TRest> options, IQueryable<T> query)
			where T : class, IEntityWithId
			where TRest : class
		{
			MethodInfo orderBy;
			switch (typeof(T).Name)
			{
				case nameof(ServiceOrderChecklist):
					orderBy = OrderByForChecklistInfo;
					break;
				default: return query;
			}
			const string parameterName = "orderByCurrentServiceOrderTime";
			var parameters = options.Request.Query;
			if (parameters.Keys.Contains(parameterName))
			{
				Guid? id = null;
				if (Guid.TryParse(options.Request.GetQueryParameter("orderByCurrentServiceOrderTime"), out var guid))
				{
					id = guid;
				}
				return (IQueryable<T>)orderBy.Invoke(this, new object[] { query, id });
			}
			return query;
		}
	}
}
