using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using LMobile.MiniForms;
using LMobile.Gen3LicenseManagement.Dao.Contracts;
using LMobile.Gen3LicenseManagement.Portal.BusinessObjects;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Developers {
	[AllowRole("Gen3Developers")]
	[AllowAdministratorRoles]
	class DevelopersApplication : BaseApplication {
		private string mySearchKey;

		protected IDeveloperDao DeveloperDao { get { return this.Session.GetService<IDeveloperDao>(); } }

		public List<StoredDeveloper> Developers;
		public StoredDeveloper CurrentDeveloper;
	
		public void Start() {
			LoadDevelopers();
			this.DisplayView<DevelopersView>();
		}
		public string SearchKey {
			get { return mySearchKey; }
			set {
				mySearchKey = value;
				this.LoadDevelopers();
			}
		}
		public void NavigateEditDeveloper(int developerID) {
			if (developerID == 0) {
				this.CurrentDeveloper = new StoredDeveloper() {
				};
			} else {
				this.CurrentDeveloper = this.DeveloperDao.GetDeveloper(developerID);
				if (this.CurrentDeveloper == null) {
					this.LoadDevelopers();
					throw new Error(Resources.SomebodyElseDeletedTheRecord());
				}
			}
			DisplayView<DevelopersView>();
		}
		public bool CanUserEditDeveloper {
			get {
				return this.Client.CurrentPrincipal.IsInRole("Gen3EditDeveloper")
					|| this.Client.CurrentPrincipal.IsInRole("Administrator");
			}
		}
		public void ResetCurrentDeveloper() {
			this.CurrentDeveloper = null;
			this.LoadDevelopers();
		}
		public void SaveCurrentDeveloper() {
			if (CurrentDeveloper.ID == 0) {
				if (string.IsNullOrEmpty(this.CurrentDeveloper.Name)) { throw new Error(Resources.NameEmpty()); }
				if (string.IsNullOrEmpty(this.CurrentDeveloper.HardwareKey)) { throw new Error(Resources.HardwareKeyEmpty()); }
				if (this.DeveloperDao.GetDeveloper(this.CurrentDeveloper.HardwareKey) != null) { throw new Error(Resources.HardwareKeyUsed()); }
				Session.Insert(CurrentDeveloper);
			} else {
				var existing = this.DeveloperDao.GetDeveloper(this.CurrentDeveloper.HardwareKey);
				if (existing != null && existing.ID != CurrentDeveloper.ID) { throw new Error(Resources.HardwareKeyUsed()); }
				if (!Session.Update(CurrentDeveloper)) throw new Error(Resources.SomebodyElseModifiedTheRecord());
			}
			this.CurrentDeveloper = null;
			this.LoadDevelopers();
		}

		public void DeleteCurrentDeveloper() {
			if (!Session.Delete(CurrentDeveloper)) throw new Error(Resources.SomebodyElseModifiedTheRecord());
			this.CurrentDeveloper = null;
			this.LoadDevelopers();
		}

		private void LoadDevelopers() {
			var developers = this.DeveloperDao.GetDevelopers(SearchKey);
			this.Developers = developers;
		}
	}
}
