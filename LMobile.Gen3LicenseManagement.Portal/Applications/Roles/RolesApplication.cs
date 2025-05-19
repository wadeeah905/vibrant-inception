using System.Collections.Generic;
using System.Web.Profile;
using LMobile.MiniForms.Classic;
using LMobile.MiniForms;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Roles {
	[AllowAdministratorRoles]
	class RolesApplication : ClassicRolesApplication
	{
		public readonly List<string> Languages;
		public RolesApplication() {
			this.Languages = new List<string>() { "", "de-DE", "en-EN" };
			if (!System.Web.Security.Roles.RoleExists("Gen3EditCustomer"))
				System.Web.Security.Roles.CreateRole("Gen3EditCustomer");
			if (!System.Web.Security.Roles.RoleExists("Gen3EditProject"))
				System.Web.Security.Roles.CreateRole("Gen3EditProject");
			if (!System.Web.Security.Roles.RoleExists("Gen3Modules"))
				System.Web.Security.Roles.CreateRole("Gen3Modules");
			if (!System.Web.Security.Roles.RoleExists("Gen3EditModule"))
				System.Web.Security.Roles.CreateRole("Gen3EditModule");
			if (!System.Web.Security.Roles.RoleExists("Gen3Developers"))
				System.Web.Security.Roles.CreateRole("Gen3Developers");
			if (!System.Web.Security.Roles.RoleExists("Gen3EditDeveloper"))
				System.Web.Security.Roles.CreateRole("Gen3EditDeveloper");
			if (!System.Web.Security.Roles.RoleExists("Gen3ActivateLicense"))
				System.Web.Security.Roles.CreateRole("Gen3ActivateLicense");
			if (!System.Web.Security.Roles.RoleExists("Gen3ExportLicense"))
				System.Web.Security.Roles.CreateRole("Gen3ExportLicense");
			if (!System.Web.Security.Roles.RoleExists("Gen3ActivateAutoDownload"))
				System.Web.Security.Roles.CreateRole("Gen3ActivateAutoDownload");
			if (!System.Web.Security.Roles.RoleExists("Gen3ExportMail"))// New Role to send E-mails
				System.Web.Security.Roles.CreateRole("Gen3ExportMail");// GKY 2019-04-10
			if (!System.Web.Security.Roles.RoleExists("Gen3DeleteInstallation"))// New Role delete Installation
				System.Web.Security.Roles.CreateRole("Gen3DeleteInstallation");// GKY 2024-08-28
		}
		public string Language;
		public string PrinterName;
		public override void DisplayListView() {
			this.DisplayView<RolesListView>();
		}
		protected override void OnEditUser() {
			if (this.IsNewUser) {
				this.Language = "de-DE";
				this.PrinterName = null;
			} else {
				var profile = ProfileBase.Create(this.User.UserName, true);
				this.Language = profile["Language"] as string;
				this.PrinterName = profile["PrinterName"] as string;
			}
			this.DisplayView<RolesView>();
		}
		protected override void OnSaveUser() {
			base.OnSaveUser();
			var profile = ProfileBase.Create(this.User.UserName, true);
			profile["Language"] = this.Language;
			profile["PrinterName"] = this.PrinterName;
			profile.Save();
		}
	}
}
