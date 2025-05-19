using System.Globalization;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using LMobile.Gen3LicenseManagement.Portal.BusinessObjects;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Licenses {
	class InstallationEditView : ApplicationView<BaseView, LicensesApplication> {
		public InstallationEditView() {
		}

		protected override void Render(BaseView master) {
			master.BackButton.BindAction(Application, app => app.LoadCustomers());

      //MLI 2017-11-29: Scrolling Horizontal
      var scroller = master.Content.AddScrollPanel(Scrolling.HorizontalAndVertical /*Scrolling.Vertical*/).SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.H100);
			var main = scroller.Layout.AddLinesLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.Panel);

			#region Project - Edit
			var editor = main.AddColumnsLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.SectionBody + new Style() { HorizontalSpacing = new Length(5, In.Points) });
			var header = editor.AddTableLayout().SetStyle(ClassicStyleSheet.WRemainder)
					.BindDisplayed(Application, app => app.CurrentCustomerShown);

			header.AddRow(row => {
				row.AddLabel().SetCaption(Resources.ContractNo());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in8)
					.BindReadOnly(Application, app => true)
					.BindText(Application, app => app.CurrentProject.ContractNo, false,
										 (app, value) => app.CurrentProject.ContractNo = value);
			});
			header.AddRow(row => {
				row.AddLabel().SetCaption(Resources.ProjectType());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder)
					.BindReadOnly(Application, app => true)
					.BindText(Application, app => app.CurrentProject.ProjectType, false,
										 (app, value) => app.CurrentProject.ProjectType = value);
			});
			header.AddRow(row => {
				row.AddLabel().SetCaption(Resources.Description());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder)
					.BindReadOnly(Application, app => true)
					.BindText(Application, app => app.CurrentProject.Description, false,
										 (app, value) => app.CurrentProject.Description = value);
			});
			header.AddRow(row => {
				row.AddLabel().SetCaption(Resources.CustomerEMail());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in3)
					.BindReadOnly(Application, app => true)
					.BindText(Application, app => app.CurrentProject.EMail, false,
										 (app, value) => app.CurrentProject.EMail = value);
			});
			header.AddRow(row => {
				row.AddLabel().SetCaption(Resources.LicenseCount());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.Right + ClassicStyleSheet.W1in9)
					.BindReadOnly(Application, app => true)
					.BindText(Application, app => app.CurrentProject.ProductiveLicenseCount.ToString("N0"), false,
										 (app, value) => app.CurrentProject.ProductiveLicenseCount = InvariantParser.ParseInt16(value));
			});
			header.AddRow(row => {
				row.AddLabel().SetCaption(Resources.TestLicenseCount());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.Right + ClassicStyleSheet.W1in9)
					.BindReadOnly(Application, app => true)
					.BindText(Application, app => app.CurrentProject.TestLicenseCount.ToString("N0"), false,
										 (app, value) => app.CurrentProject.TestLicenseCount = InvariantParser.ParseInt16(value));
			});
			var editorButtons = editor.AddLinesLayout();
			editorButtons.AddActionButton()
					.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Disk))
					.BindDisplayed(Application, app => false)
					.BindAction(Application, app => app.SaveCurrentProject());
			editorButtons.AddActionButton()
					.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.ArrowLeft))
					.BindDisplayed(Application, app => false)
					.BindAction(Application, app => app.ResetCurrentProject());
			#endregion

			#region Installation-List
			var installations = main.AddTableLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.SectionBody);
			installations.AddRow(row => {
					row.SetChildStyle(ClassicStyleSheet.Bold);
					row.AddLabel();
					row.AddLabel().SetCaption(Resources.InstallationType()).SetStyle(ClassicStyleSheet.W1in3Remainder);
					row.AddLabel().SetCaption(Resources.LicenseCount()).SetStyle(ClassicStyleSheet.W1in3Remainder);
				});
			//this.AddIteration(Installation, () => {
			//    installations.AddRow(row => {
			//        row.AddLabel()
			//           .BindCaption(Installation, project => project.ProjectType)
			//           .SetStyle(ClassicStyleSheet.W1in3Remainder);
			//        row.AddLabel()
			//           .BindCaption(Installation, project => project.EMail)
			//           .SetStyle(ClassicStyleSheet.W1in3Remainder);
			//  });
			#endregion
		}
	}
}
