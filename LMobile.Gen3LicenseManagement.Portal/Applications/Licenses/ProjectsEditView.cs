using System.Globalization;
using System.Linq;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using LMobile.Gen3LicenseManagement.Portal.BusinessObjects;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;
using System.Collections.Generic;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Licenses {
	class ProjectsEditView : ApplicationView<BaseView, LicensesApplication> {
		public readonly BindingSource<Installation> Installations;
		public BindingSource<ProjectModuleProperty> ModuleProperties;
		public ProjectsEditView() {
			this.Installations = this.CreateCollectionBindingSource(Application, app => app.Installations);
		}

		protected override void Render(BaseView master) {
			master.BackButton.BindAction(Application, app => app.NavigateEditCustomer(app.CurrentCustomer.ID));

			this.ModuleProperties = this.CreateCollectionBindingSource(Application, app => app.CurrentProject != null ? app.CurrentProject.ModuleProperties : new List<ProjectModuleProperty>());

			var scroller = master.Content.AddScrollPanel(Scrolling.Vertical).SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.H100);
			var main = scroller.Layout.AddLinesLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.Panel);

			#region Project - Edit
			var editor = main.AddProjectEditArea(Application, ModuleProperties, false);
			#endregion

			#region Installation-List
			var installations = main.AddInstallationTable(Application, Installations).SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.SectionBody);
			#endregion

			#region CreatePortable

			var createPortablePopupLink = this.CreatePopupLink();
			var createPortablePopup = master.Content.AddPopupPanel(createPortablePopupLink).SetStyle(new Style { CellAlignment = Alignment.BottomRight, TopBorder = new Length(1, In.Pixels), Width = new Length(1, In.Total) });
			createPortablePopup.Layout.SetStyle(ClassicStyleSheet.Panel);
			var createPortableLayout = createPortablePopup.Layout.AddTableLayout();
			createPortableLayout.AddRow(row => {
				row.AddLabel().SetCaption(Resources.InstallationType());
				//row.AddTextBox().SetStyle(ClassicStyleSheet.WRemainder + new Style { Height = new Length(1, In.Characters) })
				//	.BindText(Application, app => app.PortableInstallationType = null, false, (app, value) => app.PortableInstallationType = value);
				row.AddDropDownBox<StoredInstallationType>(x => x.InstallationType)
					.SetStyle(ClassicStyleSheet.W1in7 + new Style { Height = new Length(1, In.Characters) })
					.BindItems(Application, app => app.InstallationTypes)
					.BindSelectedItem(Application, app => app.InstallationTypes.FirstOrDefault(x => x.InstallationType == app.PortableInstallationType), false,
						   (app, value) => app.PortableInstallationType = value.InstallationType);
				row.AddLabel().SetStyle(ClassicStyleSheet.WRemainder);
				row.AddActionButton().SetCaption(Resources.Create())
					.Span(1, 2)
					.BindAction(Application, app => app.CreatePortableLicence());
			});

			createPortableLayout.AddRow(row => {
				row.AddLabel().SetCaption(Resources.Version());
				row.AddDropDownBox<LicenseSchemaVersion>(x => x.AssemblyVersion)
					.SetStyle(ClassicStyleSheet.W1in7 + new Style { Height = new Length(1, In.Characters) })
					.BindItems(Application, app => app.LicenseSchemaVersions)
					.BindSelectedItem(Application, app => app.LicenseSchemaVersions.FirstOrDefault(x => x.SchemaVersion == app.PortableVersion), false,
						   (app, value) => app.PortableVersion = value.SchemaVersion);
				row.AddLabel().SetStyle(ClassicStyleSheet.WRemainder);
			});

			master.Navigation.AddPopupButton(createPortablePopupLink)
					.SetCaption(Resources.CreatePortable());

			#endregion

			#region Import

			var importPopupLink = this.CreatePopupLink();
			var importPopup = master.Content.AddPopupPanel(importPopupLink).SetStyle(new Style { CellAlignment = Alignment.BottomRight, TopBorder = new Length(1, In.Pixels), Width = new Length(1, In.Total) });
			importPopup.Layout.SetStyle(ClassicStyleSheet.Panel);
			var import = importPopup.Layout.AddTableLayout();
			import.AddRow(row => {
				row.AddLabel().SetCaption(Resources.LicenseRequest());
				row.AddTextArea().SetStyle(ClassicStyleSheet.WRemainder + new Style { Height = new Length(2, In.Characters), WordWrap = true })
					.BindText(Application, app => app.LicenceRequestToImport = null, false, (app, value) => app.LicenceRequestToImport = value);
				row.AddActionButton().SetCaption(Resources.Import())
					.BindAction(Application, app => app.ImportLicenseRequest(app.LicenceRequestToImport));
			});

			master.Navigation.AddPopupButton(importPopupLink)
						.SetCaption(Resources.ImportInstallationRequest());

			#endregion

			master.Navigation.AddActionButton()
						.SetCaption(Resources.NavigateLogEntries())
						.BindAction(Application, app => app.NavigateLogEntries());
		}
	}
}
