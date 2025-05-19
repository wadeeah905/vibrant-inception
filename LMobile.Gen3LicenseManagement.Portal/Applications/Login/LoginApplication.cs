using LMobile.Gen3LicenseManagement.Portal.Applications.Licenses;
using LMobile.MiniForms.Classic;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Login {
	class LoginApplication : ClassicLoginApplication {
		protected override void OnStart()
		{
			this.DisplayView<LoginView>(); 
		}
		protected override void OnLoggedIn() {
			this.RunApplication(new LicensesApplication(), app => app.Start(null));
		}
	}
}
