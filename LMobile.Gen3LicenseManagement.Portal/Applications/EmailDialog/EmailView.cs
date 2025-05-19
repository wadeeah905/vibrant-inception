
﻿using LMobile.Gen3LicenseManagement.Portal.Applications.QuestionDialog;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;
using System.Linq;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.EmailDialog {
	class EmailView : ApplicationView<BaseView, EmailApplication> {
		protected override void Render(BaseView master) {
			var cssLabel = ClassicStyleSheet.W1in2 + ClassicStyleSheet.Bold;
			var cssContent = ClassicStyleSheet.W1in2;

			var table = master.Content.AddTableLayout().SetStyle(
				ClassicStyleSheet.Panel + ClassicStyleSheet.W100 +
				ClassicStyleSheet.H100);

			Style styleLabel = ClassicStyleSheet.W2in9;

			table.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
						.SetStyle(ClassicStyleSheet.W2in9)
						.SetCaption(Resources.@EinstellungenFurDenEmail());
				});
			});

			table.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
						.SetStyle(ClassicStyleSheet.W2in9)
						.SetCaption(Resources.@ObInput());
					collay.AddTextBox()
						.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in9)
						.BindText(Application, app => app.ObNumber, false,
								  (app, value) => app.ObNumber = value);
				});
			});

			table.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
						.SetStyle(ClassicStyleSheet.W2in9)
						.SetCaption(Resources.@ProjektManagerInput());
					collay.AddDropDownBox<string>()
						.SetStyle(ClassicStyleSheet.WRemainder +
								  new Style { Width = new Length(6, In.Characters) })
						.BindItems(Application, app => app.HerrFrau)
						.BindSelectedItem(Application,
										  app => app.HerrFrau.Contains(
													 app.PMhonorifics?.Split(' ').Last())
													 ? app.PMhonorifics.Split(' ').Last()
													 : app.HerrFrau.FirstOrDefault(),
										  true,
										  (app, selectedHerrFrau) =>
											  app.SetHerrFrauChoice(selectedHerrFrau));
					collay.AddTextBox()
						.SetStyle(ClassicStyleSheet.WRemainder +
								  new Style { Width = new Length(16, In.Characters) })
						.BindText(Application, app => app.ProjectManager, false,
								  (app, value) => app.ProjectManager = value);
				});
			});

			table.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
						.SetStyle(ClassicStyleSheet.W2in9)
						.SetCaption(Resources.@ModulInput());

					collay.AddTextBox()
						.SetStyle(ClassicStyleSheet.WRemainder +
								  new Style { Width = new Length(16, In.Characters) })
						.BindText(Application, app => app.ModulesAdded, false,
								  (app, value) => app.ModulesAdded = value)
						.BindEnabled(Application, app => app.IsRowEnabled);
					collay.AddActionButton()
						.BindStyle(
							Application,
							(app) => ClassicStyleSheet.ContentIconButton(MonoIcon.Check) +
									 new Style {
										 Height = new Length(1.1, In.Characters),
										 Width = new Length(1.3, In.Characters),
										 IconSize = new Length(0.4, In.Auto)
									 })
						.BindAction(Application, app => app.RefreshView());
				});
			});

			table.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
						.SetStyle(ClassicStyleSheet.W2in9)
						.SetCaption(Resources.@AbsenderInput());
					collay.AddTextBox()
						.SetStyle(ClassicStyleSheet.WRemainder +
								  new Style { Width = new Length(16, In.Characters) })
						.BindText(Application, app => app.SenderName, false,
								  (app, value) => app.SenderName = value);
				});
			});

			table.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
						.SetStyle(ClassicStyleSheet.W2in9)
						.SetCaption(Resources.@EmailAuswahlen());
					collay.AddDropDownBox<string>()
						.SetStyle(ClassicStyleSheet.WRemainder +
								  new Style { Width = new Length(28, In.Characters) })
						.BindItems(Application, app => app.EmailTemplates)
						.BindSelectedItem(Application, app => app.SelectedTemplate, true,
										  (app, selectedTemplate) =>
											  app.SetTemplateChoice(selectedTemplate));
					collay.AddActionButton()
						.BindStyle(
							Application,
							(app) => ClassicStyleSheet.ContentIconButton(MonoIcon.Check) +
									 new Style {
										 Height = new Length(1.1, In.Characters),
										 Width = new Length(1.3, In.Characters),
										 IconSize = new Length(0.4, In.Auto)
									 })
						.BindAction(Application, app => app.ToggleEmailTextArea());
				});
			});

			table.AddRow(row => {
				row.AddColumnsLayout(collay => {
					collay.AddLabel()
						.SetStyle(ClassicStyleSheet.W2in9)
						.SetCaption(Resources.@EmailInput());
					collay.AddTextArea()
						.SetStyle(ClassicStyleSheet.WRemainder +
								  new Style {
									  Height = new Length(12, In.Characters),
									  WordWrap = true
								  })
						.BindText(Application, app => app.ContractNoEmail, false,
								  (app, value) => app.ContractNoEmail = value)
						.BindEnabled(Application, app => app.IsEmailTextAreaEnabled);
				});
			});

			master.Navigation.BindStyle(Application,
								app => app.RightNavigationStyle());

			master.Navigation.AddActionButton()
				.SetCaption(Resources.@EmailSenden())
				.BindAction(Application, app => app.CustomSendEmail())
				.BindDisplayed(Application,
							   app => (app.Button == EQButtons.YES_NO) ||
									  (app.Button == EQButtons.YES_NO_CANCEL));

			master.Navigation.AddActionButton()
				.SetCaption(Resources.@B_CANCEL())
				.BindAction(Application, app => app.SendResponse(Responses.NO))
				.BindDisplayed(Application,
							   app => (app.Button == EQButtons.YES_NO) ||
									  (app.Button == EQButtons.YES_NO_CANCEL));
		}
	}
}
