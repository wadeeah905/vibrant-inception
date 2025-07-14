using Crm.Library.AutoFac;
using System.Collections.Generic;

namespace Crm.Service.Services.Interfaces
{
	public interface IServiceObjectService : IDependency
	{
		IEnumerable<string> GetUsedServiceObjectCategories();
	}
}
