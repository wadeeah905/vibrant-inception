using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Text;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;
using LMobile.Gen3LicenseManagement.Portal.Applications.QuestionDialog;

using LMobile.Gen3LicenseManagement.Portal.BusinessObjects;
using static System.Net.Mime.MediaTypeNames;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Licenses {
	class CustomersEditView : ApplicationView<BaseView, LicensesApplication> {
		public readonly BindingSource<TreeWrapper<Project, Installation>> Projects;
		public readonly BindingSource<Installation> Installations;
		public CustomersEditView() {
			this.Projects =
				this.CreateCollectionBindingSource(Application, app => app.Projects);
			this.Installations = this.CreateCollectionBindingSource(
				Projects, project => project.Children);
		}

		public class ModifyDateResult {
			public string FormattedDate { get; set; }
			public bool IsMoreThanThreeMonths { get; set; }
		}

		private ModifyDateResult FormatModifyDate(
			TreeWrapper<Project, Installation> project) {
			if (project?.Node == null || !project.Node.ModifyDate.HasValue) {
				return new ModifyDateResult {
					FormattedDate = "N/A",
					IsMoreThanThreeMonths = false
				};
			}

			DateTime modifyDateValue = project.Node.ModifyDate.Value;
			string formattedDate = modifyDateValue.ToString("yyyy-MM-dd HH:mm:ss");
			DateTime todayValue = DateTime.Now;
			bool isMoreThanThreeMonths = modifyDateValue < todayValue.AddMonths(-3);

			return new ModifyDateResult {
				FormattedDate = formattedDate,
				IsMoreThanThreeMonths = isMoreThanThreeMonths
			};
		}

		protected override void Render(BaseView master) {
			master.BackButton.BindAction(Application, app => app.LoadCustomers());

			var scroller =
				master.Content.AddScrollPanel(Scrolling.Vertical)
					.SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.H100);
			var main = scroller.Layout.AddLinesLayout().SetStyle(
				ClassicStyleSheet.W100 + ClassicStyleSheet.Panel);

			#region Customer - Edit
			main.AddToggleButton()
				.SetStyle(ClassicStyleSheet.SectionHeader)
				.SetCaption(Resources.Customer())
				.BindChecked(Application, app => app.CurrentCustomerShown, true,
							 (app, value) => app.CurrentCustomerShown = value);
			var editor = main.AddColumnsLayout().SetStyle(
				ClassicStyleSheet.W100 + ClassicStyleSheet.SectionBody +
				new Style() { HorizontalSpacing = new Length(5, In.Points) });
			var editorFields =
				editor.AddTableLayout()
					.SetStyle(ClassicStyleSheet.WRemainder)
					.BindDisplayed(Application, app => app.CurrentCustomerShown);
			editorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.CustomerNo());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in8)
					.BindReadOnly(Application, app => !app.CanUserEditCustomer)
					.BindText(Application, app => app.CurrentCustomer.CustomerNo, false,
							  (app, value) => app.CurrentCustomer.CustomerNo = value);
			});
			editorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.CustomerName1());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder)
					.BindReadOnly(Application, app => !app.CanUserEditCustomer)
					.BindText(Application, app => app.CurrentCustomer.Name1, false,
							  (app, value) => app.CurrentCustomer.Name1 = value);
			});
			editorFields.AddRow(row => {
				row.AddLabel();
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder)
					.BindReadOnly(Application, app => !app.CanUserEditCustomer)
					.BindText(Application, app => app.CurrentCustomer.Name2, false,
							  (app, value) => app.CurrentCustomer.Name2 = value);
			});
			editorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.CustomerAddress());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder)
					.BindReadOnly(Application, app => !app.CanUserEditCustomer)
					.BindText(Application, app => app.CurrentCustomer.Address, false,
							  (app, value) => app.CurrentCustomer.Address = value);
			});
			editorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.CustomerCity());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder)
					.BindReadOnly(Application, app => !app.CanUserEditCustomer)
					.BindText(Application, app => app.CurrentCustomer.City, false,
							  (app, value) => app.CurrentCustomer.City = value);
			});
			editorFields.AddRow(row => {
				row.AddLabel().SetCaption(Resources.CustomerEMail());
				row.AddTextBox()
					.SetStyle(ClassicStyleSheet.WRemainder + ClassicStyleSheet.W1in3)
					.BindReadOnly(Application, app => !app.CanUserEditCustomer)
					.BindText(Application, app => app.CurrentCustomer.DefaultEMail,
							  false,
							  (app, value) => app.CurrentCustomer.DefaultEMail = value);
			});
			var editorButtons = editor.AddLinesLayout().BindDisplayed(
				Application, app => app.CurrentCustomerShown);
			editorButtons.AddActionButton()
				.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.Disk))
				.BindDisplayed(Application, app => app.CanUserEditCustomer)
				.BindAction(Application, app => app.SaveCurrentCustomer());
			editorButtons.AddActionButton()
				.SetStyle(ClassicStyleSheet.ContentIconButton(MonoIcon.ArrowLeft))
				.BindDisplayed(Application, app => app.CanUserEditCustomer)
				.BindAction(Application, app => app.ResetCurrentCustomer());
			editor.AddLabel().SetStyle(
				new Style { Width = new Length(1, In.Characters) });
			#endregion

			#region Project - List
			main.AddToggleButton()
				.SetStyle(ClassicStyleSheet.SectionHeader)
				.SetCaption(Resources.Projects())
				.BindChecked(Application, app => app.ProjectsShown, true,
							 (app, value) => app.ProjectsShown = value);
			var projects =
				main.AddTableLayout()
					.SetStyle(
						ClassicStyleSheet.W100 + ClassicStyleSheet.SectionBody +
						new Style { VerticalSpacing = new Length(4, In.Points) })
					.BindDisplayed(Application, app => app.ProjectsShown);
			projects.AddRow(row => {
				row.SetChildStyle(ClassicStyleSheet.Bold);
				row.AddLabel();
				row.AddLabel().SetCaption(Resources.ContractNo());
				row.AddLabel()
					.SetCaption(Resources.ProjectType())
					.SetStyle(ClassicStyleSheet.W1in3Remainder);
				row.AddLabel()
					.SetCaption(Resources.Activity())
					.SetStyle(ClassicStyleSheet.W1in3Remainder);
				row.AddLabel().SetCaption(Resources.LicenseCount());
			});
			this.AddIteration(Projects, () => {
				projects.AddRow(row => {
					row.AddToggleButton()
						.Span(1, 2)
						.SetStyle(ClassicStyleSheet.ExpandCollapseSmall)
						.BindVisible(Projects, project => project.Children != null &&
														  project.Children.Count > 0)
						.BindChecked(Projects, project => project.Expanded, true,
									 (project, value) => project.Expanded = value);
					row.AddLabel()
						.SetStyle(new Style {
							FontSize = new Length(1.2, In.Auto),
							ContentAlignment = Alignment.MiddleLeft
						})
						.BindCaption(Projects, project => project.Node.ContractNo);
					row.AddLabel()
						.BindCaption(Projects, project => project.Node.ProjectType)
						.SetStyle(ClassicStyleSheet.W1in2Remainder);
					row.AddLabel()
						.BindCaption(Projects, project => FormatModifyDate(project).FormattedDate)
						.BindStyle(Projects, project =>
							ClassicStyleSheet.W1in2Remainder +
							(FormatModifyDate(project).IsMoreThanThreeMonths ? ClassicStyleSheet.Negative : null));

					row.AddLabel()
						.SetStyle(ClassicStyleSheet.Right)
						.BindCaption(
							Projects,
							project => project.Node.ProductiveLicenseCount.ToString(
								CultureInfo.InvariantCulture));
					row.AddActionButton()
						.Span(1, 2)
						.SetStyle(ClassicStyleSheet.FillCell +
								  ClassicStyleSheet.ContentIconButton(MonoIcon.Pencil))
						.BindAction(
							Application, Projects,
							(app, project) => app.NavigateEditProject(project.Node.ID));
					row.AddActionButton()
						.Span(1, 2)
						.SetStyle(ClassicStyleSheet.FillCell +
								  ClassicStyleSheet.ContentIconButton(MonoIcon.X))
						.BindDisplayed(Application,
									   app => app.Client.CurrentPrincipal.IsInRole(
										   "Gen3DeleteInstallation"))
						.BindAction(Application, app => {
							Responses resp =
					  ShowQuestionNotification(app, "Wirklich Loschen?");
							switch (resp) {
								case Responses.NO:
									return;
								case Responses.YES:
									app.DeactivateCurrentInstallation();
									break;
								default:
									return;
							}
						});
					row.AddLabel().SetStyle(
						new Style { Width = new Length(1, In.Characters) });
				});
				projects.AddRow(row => {
					row.AddLabel().BindCaption(
						Projects, project => project.Node.ProjectGuid.ToString());
					row.AddLabel()
						.Span(2, 1)
						.BindCaption(Projects, project => project.Node.Description)
						.SetStyle(ClassicStyleSheet.W1in3Remainder);
					row.AddLabel()
						.SetStyle(ClassicStyleSheet.Right)
						.BindCaption(Projects,
									 project => project.Node.TestLicenseCount.ToString(
										 CultureInfo.InvariantCulture));
				});
				projects.AddRow(row => {
					row.BindDisplayed(Projects, project => project.Expanded);
					row.AddLabel();
					var installations =
						row.AddInstallationTable(Application, Installations)
							.SetStyle(ClassicStyleSheet.WRemainder)
							.Span(5, 1);
				});
			});
			#endregion
			master.Navigation.AddActionButton()
				.SetCaption(Resources.DeactivateCustomer())
				.SetStyle(ClassicStyleSheet.LeftAlignedButton)
				.BindDisplayed(Application,
							   app => app.Client.CurrentPrincipal.IsInRole(
								   "Gen3DeleteInstallation"))
				.BindAction(Application, app => app.DeactivateCurrentCustomer());
			master.Navigation.AddActionButton()
				.SetCaption(Resources.NewProject())
				.BindDisplayed(
					Application,
					app => app.Client.CurrentPrincipal.IsInRole("Gen3EditProject"))
				.BindAction(Application, app => app.NavigateEditProject(0));
		}

		public Responses ShowQuestionNotification(
			MiniFormsApplication p_App, string p_Question,
			QButtons p_Button = QButtons.YES_NO,
			ViewSizes p_ViewSizes = ViewSizes.VS_0240x0320) {
			Responses response = Responses.NONE;
			p_App.RunApplication(
				new QuestionApplication(p_Question, (r) => {
					response = r;
				}, p_Button, p_ViewSizes), app => { app.ShowDialog(); });

			return response;
		}
	}
}