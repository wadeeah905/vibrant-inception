using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;
using LMobile.Gen3LicenseManagement.Portal.Applications.Roles;
using LMobile.Gen3LicenseManagement.Portal.Applications.Modules;
using LMobile.Gen3LicenseManagement.Portal.Applications.Developers;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Licenses {
	internal class CustomersListView : ApplicationView<BaseView, LicensesApplication> {
		public readonly BindingSource<Customer> Customers;
		public CustomersListView() {
			this.Customers = this.CreateCollectionBindingSource(Application, app => app.Customers);
		}

		protected override void Render(BaseView master) {
			// master.BackButton.BindAction(Application, app => app.ExitApplication());
			master.BackButton.BindAction(Application, app => app.SigningOff());
			master.PopupMenu.AddActionButton()
				.SetCaption(Resources.RolesMenu())
				.BindDisplayed(Application, app => app.CanRunApplication<RolesApplication>())
				.BindAction(Application, app => app.RunApplication(new RolesApplication(), roles => roles.Start()));
			master.PopupMenu.AddActionButton()
				.SetCaption(Resources.DevelopersMenu())
				.BindDisplayed(Application, app => app.CanRunApplication<DevelopersApplication>())
				.BindAction(Application, app => app.RunApplication(new DevelopersApplication(), developers => developers.Start()));
			master.PopupMenu.AddActionButton()
				.SetCaption(Resources.ModulesMenu())
				.BindDisplayed(Application, app => app.CanRunApplication<ModulesApplication>())
				.BindAction(Application, app => app.RunApplication(new ModulesApplication(), modules => modules.Start()));
			master.SearchBox.BindText(Application, app => app.SearchKey, (app, value) => app.SearchKey = value);

			var main = master.Content.AddLinesLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.H100);

			#region Customer - List
			var scroller = main.AddScrollPanel(Scrolling.Vertical).SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.HRemainder);
			var customers = scroller.Layout.AddTableLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.Panel);
			customers.AddRow(row => {
				row.SetChildStyle(ClassicStyleSheet.Bold);
				row.AddLabel();
				row.AddLabel().SetCaption(Resources.Name()).SetStyle(ClassicStyleSheet.W1in3Remainder);
				row.AddLabel().SetCaption(Resources.CustomerAddress()).SetStyle(ClassicStyleSheet.W1in3Remainder);
				row.AddLabel().SetCaption(Resources.CustomerEMail()).SetStyle(ClassicStyleSheet.W1in3Remainder);
				row.AddLabel();
				// MLI 2017-11-29: Design
				row.AddLabel().SetStyle(new Style { Width = new Length(1, In.Characters) });
			});
			this.AddIteration(Customers, () => {
				customers.AddRow(row => {
					row.AddLabel().BindCaption(Customers, customer => customer.CustomerNo);
					row.AddLabel().BindCaption(Customers, customer => customer.Name1).SetStyle(ClassicStyleSheet.W1in3Remainder);
					row.AddLabel().BindCaption(Customers, customer => customer.Address).SetStyle(ClassicStyleSheet.W1in3Remainder);
					row.AddLabel().BindCaption(Customers, customer => customer.DefaultEMail).SetStyle(ClassicStyleSheet.W1in3Remainder);
					row.AddActionButton()
						.Span(1, 2)
						.SetStyle(ClassicStyleSheet.FillCell + ClassicStyleSheet.ContentIconButton(MonoIcon.Pencil))
						.BindAction(Application, Customers, (app, customer) => app.NavigateEditCustomer(customer.ID));
					row.AddLabel();
				});

				customers.AddRow(row => {
					row.AddLabel();
					row.AddLabel().BindCaption(Customers, customer => customer.Name2).SetStyle(ClassicStyleSheet.W1in3Remainder);
					row.AddLabel().BindCaption(Customers, customer => customer.City).SetStyle(ClassicStyleSheet.W1in3Remainder);
				});
			});
			#endregion

			master.Navigation.AddActionButton()
				.SetCaption(Resources.NewCustomer())
				.BindDisplayed(Application, app => app.Client.CurrentPrincipal.IsInRole("Gen3EditCustomer"))
				.BindAction(Application, app => app.NavigateEditCustomer(0));
		}
	}
}
