using System;
using LMobile.MiniForms.Classic;
using LMobile.MiniForms;
using System.Configuration;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Login {
	class LoginView : ApplicationView<ClassicLoginView, LoginApplication> {
		public LoginView() : base() {
			BaseView.Init(this);
		}
		protected override void Render(ClassicLoginView master) {
		}
	}
}
