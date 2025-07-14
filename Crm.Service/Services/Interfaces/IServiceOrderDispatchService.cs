using Crm.Library.AutoFac;
using System.Collections.Generic;

namespace Crm.Service.Services.Interfaces
{
	public interface IServiceOrderDispatchService : IDependency
	{
		IEnumerable<string> GetUsedCauseOfFailures();
		IEnumerable<string> GetUsedComponents();
		IEnumerable<string> GetUsedErrorCodes();
		IEnumerable<string> GetUsedServiceOrderDispatchRejectReasons();
	}
}
