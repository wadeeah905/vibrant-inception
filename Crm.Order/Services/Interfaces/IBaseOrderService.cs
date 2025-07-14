namespace Crm.Order.Services.Interfaces
{
	using System;
	using System.Collections.Generic;

	using Crm.Library.AutoFac;
	using Crm.Library.Model;
	using Crm.Order.Model;

	public interface IBaseOrderService : IDependency
	{
		BaseOrder GetOrder(Guid id);
		bool OrderCanBeEditedByUser(User user, BaseOrder order);
		void SaveOrder(BaseOrder baseOrder, bool? close = null);
		void DeleteOrder(Guid id);
		void DeleteOrder(BaseOrder baseOrder);
		void SetAddressData(BaseOrder baseOrder);
		bool TrySendMail(BaseOrder order);
		byte[] CreatePdf(BaseOrder baseOrder);
		IEnumerable<string> GetUsedCalculationPositionTypes();
		IEnumerable<string> GetUsedOrderCategories();
		IEnumerable<string> GetUsedOrderStatuses();
		IEnumerable<string> GetUsedCurrencies();
	}
}
