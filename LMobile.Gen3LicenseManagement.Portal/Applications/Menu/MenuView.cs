using LMobile.MiniForms;
using LMobile.MiniForms.Classic;
using LMobile.Gen3LicenseManagement.Portal.Applications.Menu;
using LMobile.Gen3LicenseManagement.Portal.Applications;

namespace LMobile.Gen3LicenseManagement.Portal.Menu
{
  class MenuView : ApplicationView<ClassicMenuView, MenuApplication> {
		public MenuView() {
			BaseView.Init(this);
		}
		protected override void Render(ClassicMenuView master) {			
		}
	}
}
