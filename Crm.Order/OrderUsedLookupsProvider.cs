using Crm.Library.Globalization.Lookup;
using Crm.Model.Lookups;
using Crm.Order.Model.Lookups;
using Crm.Order.Services.Interfaces;
using System;
using System.Collections.Generic;

namespace Crm.Order
{
	public class DynamicFormsUsedLookupsProvider : IUsedLookupsProvider
	{
		private readonly IBaseOrderService orderService;
		public DynamicFormsUsedLookupsProvider(IBaseOrderService orderService)
		{
			this.orderService = orderService;
		}

		public virtual IEnumerable<object> GetUsedLookupKeys(Type lookupType)
		{
			if (lookupType == typeof(CalculationPositionType))
			{
				return orderService.GetUsedCalculationPositionTypes();
			}

			if (lookupType == typeof(OrderCategory))
			{
				return orderService.GetUsedOrderCategories();
			}

			if (lookupType == typeof(OrderStatus))
			{
				return orderService.GetUsedOrderStatuses();
			}

			if (lookupType == typeof(Currency))
			{
				return orderService.GetUsedCurrencies();
			}

			return new List<object>();
		}
	}
}
