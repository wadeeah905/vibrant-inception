using LMobile.MiniForms;
using LMobile.MiniForms.Classic;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Roles {
	class RolesView : ApplicationView<ClassicRolesView, RolesApplication> {
		public RolesView() {
			BaseView.Init(this);
		}
		protected override void Render(ClassicRolesView master) {
			master.Profile.AddRow(row => {
				row.AddLabel().SetCaption(Resources.lblLanguage());
				row.AddDropDownBox<string>()
					.BindItems(Application, app => app.Languages)
					.BindSelectedItem(Application, app => app.Language, false, (app, value) => app.Language = value);
			});
			master.Profile.AddRow(row => {
				row.AddLabel().SetCaption(Resources.lblPrinterName());
				row.AddTextBox()
					.BindText(Application, app => app.PrinterName, false, (app, value) => app.PrinterName = value);
			});
		}
	}
}
