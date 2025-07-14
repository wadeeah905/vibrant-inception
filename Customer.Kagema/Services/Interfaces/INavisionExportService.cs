namespace Customer.Kagema.Services.Interfaces
{
	using System.Collections.Generic;
	using System.Linq;

	using Crm.Library.AutoFac;
	using Crm.Service.Model;

	public interface INavisionExportService : IDependency
	{
		IQueryable<ServiceOrderHead> GetUnExportedServiceOrders(int batchCount, int batchSize);
		//IList<ServiceOrderHead> GetPlannedServiceOrders();

		void ExportCompletedServiceOrder(ServiceOrderHead serviceOrder);
		void ExportPlannedServiceOrder(ServiceOrderHead serviceOrder);
		//void ExportUnPlannedServiceOrder(ServiceOrderHead serviceOrder);
		void UpdateExportServiceOrder(ServiceOrderHead entity);
		void UpdateExportNewServiceOrder(ServiceOrderHead entity);
		
		IQueryable<ServiceOrderHead> GetUnExportedLmobileStatusServiceOrders(int batchCount, int batchSize);
		void UpdateStatusServiceOrder(ServiceOrderHead serviceOrder);

		IQueryable<ServiceOrderHead>  GetNewServiceOrders(int batchCount, int batchSize);
		IQueryable<ServiceOrderHead>  GetPlannedServiceOrders(int batchCount, int batchSize);

		void ExportNewServiceOrder(ServiceOrderHead serviceOrder);
	}
}
