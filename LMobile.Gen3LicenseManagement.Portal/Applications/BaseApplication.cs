using LMobile.Gida;
using LMobile.MiniForms;

namespace LMobile.Gen3LicenseManagement.Portal.Applications {
	class BaseApplication : MiniFormsApplication {
		protected GidaSession Session { get { return GidaConfiguration.Factories["LicenseManagement"].CurrentSession; } }
	}
}
