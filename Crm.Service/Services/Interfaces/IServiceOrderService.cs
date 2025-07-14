namespace Crm.Service.Services.Interfaces
{
	using Crm.Library.AutoFac;

	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;
	using System;
	public interface IServiceOrderService : IDependency
	{
		string GetNewOrderNo(ServiceOrderType serviceOrderType);
		void Save(ServiceOrderHead serviceOrderHead);
		byte[] CreateDispatchReportAsPdf(Guid dispatchId);
		byte[] CreateDispatchReportAsPdf(ServiceOrderDispatch dispatch);
		byte[] CreateServiceOrderReportAsPdf(string orderNo);
		byte[] CreateServiceOrderReportAsPdf(ServiceOrderHead serviceOrderHead);
	}
}
