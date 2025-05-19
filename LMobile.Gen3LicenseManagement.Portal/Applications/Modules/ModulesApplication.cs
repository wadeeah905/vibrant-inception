using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using LMobile.MiniForms;
using LMobile.Gen3LicenseManagement.Dao.Contracts;
using LMobile.Gen3LicenseManagement.Portal.BusinessObjects;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Modules {
	[AllowRole("Gen3Modules")]
	[AllowAdministratorRoles]
	class ModulesApplication : BaseApplication {
		protected ILicenseDao LicenseDao { get { return this.Session.GetService<ILicenseDao>(); } }
		protected IModuleDao ModuleDao { get { return this.Session.GetService<IModuleDao>(); } }
		public List<TreeWrapper<Module, ModuleProperty>> Modules;
		public List<StoredProjectType> ProjectTypes;
		public List<ModuleProperty> AllModuleProperties;
		public List<ModuleProperty> AllModulePropertiesExceptCurrentModule(Module module) {
			return
				this.AllModuleProperties.Where(prop => !Modules.First(m => m.Node.ID == module.ID).Children.Contains(prop))
					.ToList();
		}
		public Module CurrentModule;
		public ModuleProperty CurrentModuleProperty;
		public ModuleProperty CurrentSelectedModuleProperty;
		public void Start() {
			this.ProjectTypes = LicenseDao.GetProjectTypes();
			LoadModules();
			this.DisplayView<ModulesView>();
		}

		public void NavigateEditModule(int moduleID) {
			if (moduleID == 0) {
				this.CurrentModule = new Module() {
					ModuleGuid = System.Guid.NewGuid(),
				};
			} else {
				this.CurrentModule = this.ModuleDao.GetModule(moduleID);
				if (this.CurrentModule == null) {
					this.LoadModules();
					throw new Error(Resources.SomebodyElseDeletedTheRecord());
				}
			}
			DisplayView<ModulesView>();
		}
		public bool CanUserEditModule {
			get { return this.Client.CurrentPrincipal.IsInRole("Gen3EditModule"); }
		}
		public void ResetCurrentModule() {
			this.CurrentModule = null;
			this.LoadModules();
		}
		public void SaveCurrentModule() {
			if (CurrentModule.ID == 0) {
				if (string.IsNullOrEmpty(this.CurrentModule.ProjectType)) { throw new Error(Resources.ProjectTypeEmpty()); }
				if (string.IsNullOrEmpty(this.CurrentModule.Description)) { throw new Error(Resources.DescriptionEmpty()); }
				Session.Insert(CurrentModule);
				LicenseDao.LogEntry(null, null, MessageTypes.ModuleCreated, "Module '" + CurrentModule.Description + "' created by '" + Client.CurrentPrincipal.Identity.Name + "'.");
			} else {
				if (!Session.Update(CurrentModule)) throw new Error(Resources.SomebodyElseModifiedTheRecord());
				LicenseDao.LogEntry(null, null, MessageTypes.ModuleModified, "Module '" + CurrentModule.Description + "' modified by '" + Client.CurrentPrincipal.Identity.Name + "'.");
			}
			this.CurrentModule = null;
			this.LoadModules();
		}

		public void NavigateEditModuleProperty(int moduleID, int modulePropertyID) {
			if (modulePropertyID == 0) {
				this.CurrentModuleProperty = new ModuleProperty();
			} else {
				this.CurrentModuleProperty = this.ModuleDao.GetModuleProperty(modulePropertyID);
				if (this.CurrentModuleProperty == null) {
					this.LoadModules();
					throw new Error(Resources.SomebodyElseDeletedTheRecord());
				}
			}
			DisplayView<ModulesView>();
		}
		public void ResetCurrentModuleProperty() {
			CurrentModuleProperty = null;
		}
		public void SaveCurrentModuleProperty() {
			if (CurrentModuleProperty.ID == 0) {
				Session.Insert(CurrentModuleProperty);
				CurrentModuleProperty = ModuleDao.GetModuleProperty(CurrentModuleProperty.ID);
				LicenseDao.LogEntry(null, null, MessageTypes.ModulePropertyCreated, "Module-Property '" + CurrentModuleProperty.Description + "' created", "Property '" + CurrentModuleProperty.Description + "' created by '" + Client.CurrentPrincipal.Identity.Name + "'.");
			} else {
				if (!Session.Update(CurrentModuleProperty)) throw new Error(Resources.SomebodyElseModifiedTheRecord());
				LicenseDao.LogEntry(null, null, MessageTypes.ModulePropertyModified, "Module-Property '" + CurrentModuleProperty.Description + "' modified", "Property '" + CurrentModuleProperty.Description + "' modified by '" + Client.CurrentPrincipal.Identity.Name + "'.");
			}
			this.CurrentModuleProperty = null;
			this.AllModuleProperties = this.ModuleDao.GetModuleProperties();
		}
		public void AddExistingModulePropertyToModule(Module module, ModuleProperty prop) {
			var mpInM = new ModulePropertiesInModules {
				ModuleID = module.ID,
				ModulePropertyID = prop.ID,
			};
			Session.Insert(mpInM);
			LicenseDao.LogEntry(null, null, MessageTypes.ModuleModified, "Module-Property '" + prop.Description + "' added", "Property '" + prop.Description + "' added to Module '" + module.Description + "' by '" + Client.CurrentPrincipal.Identity.Name + "'.");

			Modules.First(m => m.Node.ID == module.ID).Children.Add(prop);
			CurrentSelectedModuleProperty = null;
		}
		public void RemoveExistingModulePropertyFromModule(Module module, ModuleProperty prop) {
			var mpInM =
				ModuleDao.GetModulePropertiesInModules()
					.FirstOrDefault(x => x.ModuleID == module.ID && x.ModulePropertyID == prop.ID);
			if (mpInM != null) {
				Session.Delete(mpInM);
				LicenseDao.LogEntry(null, null, MessageTypes.ModuleModified, "Module-Property '" + prop.Description + "' removed",
					"Property '" + prop.Description + "' removed from Module '" + module.Description + "' by '" +
					Client.CurrentPrincipal.Identity.Name + "'.");
			}
			Modules.First(m => m.Node.ID == module.ID).Children.Remove(prop);
		}

		private void LoadModules() {
			var modules = this.ModuleDao.GetModules();
			this.AllModuleProperties = this.ModuleDao.GetModuleProperties();
			var allModulePropertiesInModules = this.ModuleDao.GetModulePropertiesInModules();
			this.Modules = modules.Select(module => new TreeWrapper<Module, ModuleProperty> {
				Node = module,
				Expanded = false,
				Children = this.AllModuleProperties.Where(prop => allModulePropertiesInModules.Any(x => x.ModuleID == module.ID && x.ModulePropertyID == prop.ID)).ToList()
			}).ToList();
		}
	}
}
