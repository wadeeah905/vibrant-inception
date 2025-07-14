using Autofac;
using Autofac.Core;

using Crm.Library.AutoFac;
using Crm.Service.BackgroundServices;
using Customer.Kagema.BackgroundServices;

namespace Customer.Kagema
{

	public class KagemaModule : Module
	{
		protected override void AttachToComponentRegistration(IComponentRegistry componentRegistry, IComponentRegistration registration)
		{
			base.AttachToComponentRegistration(componentRegistry, registration);
			registration.ReplaceRegistration<DispatchReportSenderAgent, KagemaDispatchReportSenderAgent>();
			registration.ReplaceRegistration<ServiceOrderDocumentSaverAgent, KagemaServiceOrderDocumentSaverAgent>();
		}
	}
}
