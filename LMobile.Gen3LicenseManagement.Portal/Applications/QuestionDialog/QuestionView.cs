using LMobile.Gen3LicenseManagement.Portal.Applications;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;
using System.Drawing;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.QuestionDialog {
	class QuestionView : ApplicationView<BaseView, QuestionApplication> {
		public QuestionView() {
			// DesignSize = Styles.ViewSize240x320;
			// DesignSize = Styles.CurrentViewSize;
		}

		protected override void Render(BaseView master) {
			// master.SetTitleLineTwo(Resources.L_Question());

			var cssLabel = ClassicStyleSheet.W1in2 + ClassicStyleSheet.Bold;
			var cssContent = ClassicStyleSheet.W1in2;

			var table = master.Content.AddTableLayout().SetStyle(ClassicStyleSheet.Panel + ClassicStyleSheet.W100 + ClassicStyleSheet.H100);

			// Bild und Art der Meldung
			table.AddRow(row => {
				row.AddColumnsLayout(l => {
					l.AddActionButton().BindStyle(
						Application, app => new Style() {// BackgroundImage = ImageResources.confirm_question,
							CellFitting = Fitting.Fill, Height = new Length(57, LengthUnit.Pixels),
							Width = new Length(56, LengthUnit.Pixels), BackgroundColor = Color.FromArgb(0xE6, 0xE6, 0xE6)
						});
					l.AddLabel()
						.BindStyle(Application,
								   app => ClassicStyleSheet.Bold + new Style() {
									   TopMargin = new Length(15, In.Pixels), LeftMargin = new Length(-60, In.Pixels),
									   FontSize = new Length(30, In.Pixels), ForegroundColor = Color.Blue
								   })
						.BindCaption(Application, app => app.Question);
				});
			});

			// Text
			// table.AddRow(row =>
			//   {
			//     row.AddLabel()
			//       .Span(2, 1)
			//       .SetStyle(new Style()
			//       {
			//         TopMargin = new Length(20, In.Pixels)
			//       } + ClassicStyleSheet.WordWrap)
			//       .BindCaption(Application, app => app.Question);
			//   });

			master.Navigation.BindStyle(Application, app => app.RightNavigationStyle() /*ClassicStyleSheet.W100*/);

			master.Navigation.AddActionButton()
				.SetCaption(Resources.B_YES())
				.BindAction(Application, app => app.SendResponse(Responses.YES))
				.BindDisplayed(Application, app => (app.Button == QButtons.YES_NO) || (app.Button == QButtons.YES_NO_CANCEL))
				.BindStyle(Application, app => new Style() { ContentAlignment = Alignment.MiddleCenter } + app.RightNavigationButtonStyle());

			master.Navigation.AddActionButton()
				.SetCaption(Resources.B_NO())
				.BindAction(Application, app => app.SendResponse(Responses.NO))
				.BindDisplayed(Application, app => (app.Button == QButtons.YES_NO) || (app.Button == QButtons.YES_NO_CANCEL))
				.BindStyle(Application, app => new Style() { ContentAlignment = Alignment.MiddleCenter } + app.RightNavigationButtonStyle());

			master.Navigation.AddActionButton()
				.SetCaption(Resources.B_CANCEL())
				.BindAction(Application, app => app.SendResponse(Responses.CANCEL))
				.BindDisplayed(Application, app => (app.Button == QButtons.YES_NO_CANCEL))
				.BindStyle(Application, app => new Style() { ContentAlignment = Alignment.MiddleCenter } + app.RightNavigationButtonStyle());

			master.Navigation.AddActionButton()
				.SetCaption(Resources.B_OK())
				.BindAction(Application, app => app.SendResponse(Responses.OK))
				.BindDisplayed(Application, app => (app.Button == QButtons.OK_BACK))
				.BindStyle(Application, app => new Style() { ContentAlignment = Alignment.MiddleCenter } + app.RightNavigationButtonStyle());

			master.Navigation.AddActionButton()
				.SetCaption(Resources.B_Back())
				.BindAction(Application, app => app.SendResponse(Responses.BACK))
				.BindDisplayed(Application, app => (app.Button == QButtons.OK_BACK))
				.BindStyle(Application, app => new Style() { ContentAlignment = Alignment.MiddleCenter } + app.RightNavigationButtonStyle());
		}
	}
}
