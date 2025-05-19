using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using LMobile.MiniForms;
using LMobile.Gen3LicenseManagement.Portal.BusinessObjects;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using LMobile.MiniForms.Classic;
using System.Drawing;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Developers {
	class DevelopersView : ApplicationView<BaseView, DevelopersApplication> {
		public readonly BindingSource<StoredDeveloper> Developers;

		public DevelopersView() {
			this.Developers = this.CreateCollectionBindingSource(Application, app => app.Developers);
		}

		protected override void Render(BaseView master) {
			master.BackButton.BindAction(Application, app => app.ExitApplication());

			master.SearchBox
						.BindText(Application, app => app.SearchKey, (app, value) => app.SearchKey = value);

			var main = master.Content.AddLinesLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.H100);

			#region Developer

			var editor = main.AddColumnsLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.SectionBody + new Style() { HorizontalSpacing = new Length(5, In.Points) });
			var editorFields = editor.AddTableLayout().SetStyle(ClassicStyleSheet.WRemainder)
					.BindDisplayed(Application, app => app.CurrentDeveloper != null);
			editorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.Name());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in2)
					.BindReadOnly(Application, app => !app.CanUserEditDeveloper)
					.BindText(Application, app => app.CurrentDeveloper == null ? null : app.CurrentDeveloper.Name, false, (app, value) => app.CurrentDeveloper.Name = value);
			});
			editorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.HardwareKey());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in2)
					.BindReadOnly(Application, app => !app.CanUserEditDeveloper)
					.BindText(Application, app => app.CurrentDeveloper == null ? null : app.CurrentDeveloper.HardwareKey, false, (app, value) => app.CurrentDeveloper.HardwareKey = value);
			});
			var editorButtons = editor.AddLinesLayout().BindDisplayed(Application, app => app.CurrentDeveloper != null);
			editorButtons.AddActionButton()
					.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Disk))
					.BindDisplayed(Application, app => app.CanUserEditDeveloper)
					.BindAction(Application, app => app.SaveCurrentDeveloper());
			editorButtons.AddActionButton()
					.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.X))
					.SetConfirmationQuestion(Resources.DeveloperDeleteConfirmation())
					.BindDisplayed(Application, app => app.CanUserEditDeveloper && app.CurrentDeveloper != null && app.CurrentDeveloper.ID != 0)
					.BindAction(Application, app => app.DeleteCurrentDeveloper());
			editorButtons.AddActionButton()
					.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.ArrowLeft))
					.BindDisplayed(Application, app => app.CanUserEditDeveloper)
					.BindAction(Application, app => app.ResetCurrentDeveloper());
			#endregion

			#region Developer-List

			var scroller = main.AddScrollPanel(Scrolling.Vertical).SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.HRemainder);
			var customers = scroller.Layout.AddTableLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.Panel);
			customers.AddRow(row => {
				row.SetChildStyle(ClassicStyleSheet.Bold);
				row.AddLabel().SetCaption(Resources.Name()).SetStyle(ClassicStyleSheet.W1in3Remainder);
				row.AddLabel().SetCaption(Resources.HardwareKey()).SetStyle(ClassicStyleSheet.W2in3Remainder);
				row.AddLabel();
			});
			this.AddIteration(Developers, () => {
				customers.AddRow(row => {
					row.AddLabel()
					   .BindCaption(Developers, x => x.Name);
					row.AddLabel()
						 .BindCaption(Developers, x => x.HardwareKey)
						 .SetStyle(ClassicStyleSheet.W2in3Remainder);
					row.AddActionButton().SetStyle(ClassicStyleSheet.FillCell + ClassicStyleSheet.ContentIconButton(MonoIcon.Pencil))
						.BindAction(Application, Developers, (app, x) => app.NavigateEditDeveloper(x.ID));
				});
			});
			scroller.BindDisplayed(Application, app => app.CurrentDeveloper == null);
			#endregion

			master.Navigation.AddActionButton()
						.SetCaption(Resources.NewDeveloper())
						.BindAction(Application, app => app.NavigateEditDeveloper(0));
		}
	}
}
