using System;
using System.Linq;
using System.Text;
using System.Net.Mail;
using System.Collections.Generic;
using LMobile.MiniForms;
using LMobile.Gen3LicenseManagement.Dao.Contracts;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using LMobile.Gen3LicenseManagement.Dao.Services;
using LMobile.Gen3LicenseManagement.Portal.BusinessObjects;
using System.Configuration;
using System.Drawing;
using LMobile.Gida;
using LMobile.Gen3LicenseManagement.Portal.Applications.QuestionDialog;
using LMobile.Gen3LicenseManagement.Portal.Applications.Emails;
using System.Diagnostics;
using LMobile.Gen3LicenseManagement.Portal.Applications.EmailDialog;



namespace LMobile.Gen3LicenseManagement.Portal.Applications.Licenses {

	class LicensesApplication : BaseApplication {
		private readonly List<int> installationIds = new List<int>();

		public LicensesApplication() {
			HasAllChanges = false;
		}
		protected ILicenseDao LicenseDao { get { return this.Session.GetService<ILicenseDao>(); } }
		protected IModuleDao ModuleDao { get { return this.Session.GetService<IModuleDao>(); } }
		private string mySearchKey;
		public List<Customer> Customers;
		public Customer CurrentCustomer;
		public bool CurrentCustomerShown;
		public bool CurrentProjectShown;
		public int CurrentProjectModulcounter;
		public List<TreeWrapper<Project, Installation>> Projects;
		public Project CurrentProject;
		public List<Installation> Installations;
		public List<StoredProjectType> ProjectTypes;
		public List<StoredInstallationType> InstallationTypes;
		public List<Module> Modules;
		public List<ModuleProperty> ModuleProperties;
		public List<ProjectLog> LogEntries;
		public List<LicenseSchemaVersion> LicenseSchemaVersions;
		private Module mySelectedNewModule;
		public Module SelectedNewModule {
			get { return mySelectedNewModule; }
			set {
				//MLI 2017-11-29: reseting
				if (CurrentProject == null) {
					ModuleProperties = null;
					mySelectedNewModule = null;
					return;
				}
				var testProject = LicenseDao.GetProject(CurrentProject.ContractNo);
				if (testProject == null) throw new Error(Resources.PleaseSaveProjectFirst());

				mySelectedNewModule = value;
				this.ModuleProperties = mySelectedNewModule != null ? ModuleDao.GetModuleProperties(mySelectedNewModule.ID) : null;

				if (this.CurrentProject.ModuleProperties == null || this.CurrentProject.ModuleProperties.Count == 0 && (this.ModuleProperties != null && this.ModuleProperties.Count > 0)) {
					using (var transaction = Session.BeginTransaction()) {
						foreach (var p in this.ModuleProperties) {
							var newProjectModule = new ProjectModuleProperty {
								ModuleProperty = p,
								ModulePropertyID = p.ID,
								CreateDate = DateTime.Now,
								CreateUser = Client.CurrentPrincipal.Identity.Name,
								ExpiryDate = this.CurrentProject.ExpiryDate,
								ExpiryInMonths = null,
								ProductiveLicenseCount = this.CurrentProject.ProductiveLicenseCount,
								TestLicenseCount = this.CurrentProject.TestLicenseCount,
								ProjectID = this.CurrentProject.ID,
							};
							Session.Insert(newProjectModule);
							LicenseDao.LogEntry(CurrentCustomer.ID, CurrentProject.ID, MessageTypes.ProjectModified, "Module" + newProjectModule + " added by '" + Client.CurrentPrincipal.Identity.Name + "'."); //logadded
							if (this.CurrentProject.ModuleProperties == null)
								this.CurrentProject.ModuleProperties = new List<ProjectModuleProperty>();
							this.CurrentProject.ModuleProperties.Add(newProjectModule);
						}
						transaction.Commit();

					}
					this.ModuleProperties = null;
					mySelectedNewModule = null;
				} else {
					if (this.ModuleProperties != null) {
						for (int i = this.ModuleProperties.Count - 1; i >= 0; i--) {
							if (this.CurrentProject.ModuleProperties.Any(x => x.ModuleProperty.ID == this.ModuleProperties[i].ID))
								this.ModuleProperties.RemoveAt(i);
						}
						if (this.ModuleProperties.Count == 0) {
							this.ModuleProperties = null;
							mySelectedNewModule = null;
						} else {
							this.NewModulePropertyExpiryDate = DateTime.Now;
							this.NewModulePropertyLicenceCount = 0;
							this.NewModulePropertyTestLicenceCount = 1;
						}
					}
				}
			}
		}
		public ModuleProperty SelectedNewModuleProperty { get; set; }
		public int NewModulePropertyLicenceCount { get; set; }
		public int NewModulePropertyTestLicenceCount { get; set; }
		public DateTime NewModulePropertyExpiryDate { get; set; }
		//MLI 2017-11-29: Fill property data

		public void ShowEmailView(int installationID, string InstaVersion) {
			Responses resp = ShowEmailView(
				this,
				new List<int>(), // Empty list instead of using GetInstallationIds
				installationID,
				InstaVersion,
				CurrentProject.ProjectGuid,
				CurrentProject.ContractNo, // Pass contract number
				Client.CurrentPrincipal.Identity.Name // Pass current user as sender
			);

			// Removed the ClearInstallationIds call
		}

		public bool CanFill { get; set; }
		//MLI 2017-11-30: Module search
		public string SearchModuleName { get; internal set; }
		public int? AllModulesPropertyLicenceCount {
			get { /*return 0;*/
				return (null);
			}
			set {
				HasAllChanges = true;
				foreach (var mod in this.CurrentProject.ModuleProperties) {
					mod.ProductiveLicenseCount = value.GetValueOrDefault();
				}
			}
		}
		public int? AllModulesPropertyTestLicenceCount {
			get { /*return 0;*/
				return (null);
			}
			set {
				HasAllChanges = true;
				foreach (var mod in this.CurrentProject.ModuleProperties) {
					mod.TestLicenseCount = value.GetValueOrDefault();
				}
			}
		}
		public DateTime AllModulesPropertyExpiryDate {
			get { return CurrentProject.ExpiryDate; }
			set {
				HasAllChanges = true;
				foreach (var mod in this.CurrentProject.ModuleProperties) {
					mod.ExpiryDate = value;
				}
			}
		}

		public void SaveAllProjectModuleProperties() {
			foreach (var mod in this.CurrentProject.ModuleProperties) {
				Session.Update(mod);
			}
			HasAllChanges = false;
			LicenseDao.LogEntry(CurrentCustomer.ID, CurrentProject.ID, MessageTypes.ProjectModified, "All Project module saved by '" + Client.CurrentPrincipal.Identity.Name + "'."); //logadded

		}
		public void SaveProjectModuleProperty(ProjectModuleProperty pMod) {
			//if (this.SelectedNewModuleProperty == null)
			if (pMod == null && this.SelectedNewModuleProperty == null) {
				return;
			}

			Module dummy = null;

			if (pMod == null) {
				pMod = new ProjectModuleProperty {
					ModulePropertyID = this.SelectedNewModuleProperty.ID,
					ProductiveLicenseCount = this.NewModulePropertyLicenceCount,
					ProjectID = this.CurrentProject.ID,
					TestLicenseCount = this.NewModulePropertyTestLicenceCount,
					//ExpiryDate = this.CurrentProject.ExpiryDate,
					ExpiryDate = this.NewModulePropertyExpiryDate,
					ExpiryInMonths = 0,


				};
				Session.Insert(pMod);
				LicenseDao.LogEntry(CurrentCustomer.ID, CurrentProject.ID, MessageTypes.ModuleAdded, "Module " + SearchModuleName + " added by '" + Client.CurrentPrincipal.Identity.Name + "'."); //logadded
																																																   //this.NewModulePropertyExpiryDate = DateTime.Now;
				this.NewModulePropertyLicenceCount = 0;
				this.NewModulePropertyTestLicenceCount = 0;
				this.SelectedNewModuleProperty = null;
				dummy = this.SelectedNewModule;
				this.SelectedNewModule = null;

			} else {
				Session.Update(pMod);
			}

			//Had to comment this as its remove all new edits that are not saved yet
			this.CurrentProject.ModuleProperties = LicenseDao.GetProjectModuleProperties(this.CurrentProject.ID);

			//ModuleProperties = ModuleDao.GetModuleProperties(mySelectedNewModule.ID);
			if (dummy != null) {
				SelectedNewModule = dummy;
			}

		}
		public void DeleteProjectModuleProperty(ProjectModuleProperty pMod) {
			Session.Delete(pMod);
			LicenseDao.LogEntry(CurrentCustomer.ID, CurrentProject.ID, MessageTypes.ProjectModified, "Project module deleted by '" + Client.CurrentPrincipal.Identity.Name + "'."); //logadded
			this.CurrentProject.ModuleProperties = LicenseDao.GetProjectModuleProperties(this.CurrentProject.ID);
		}

		public bool ProjectsShown;
		public void Start(string parameter) {
			this.SearchKey = parameter;
			this.ProjectTypes = LicenseDao.GetProjectTypes();
			this.InstallationTypes = LicenseDao.GetInstallationTypes();
			this.LicenseSchemaVersions = new List<LicenseSchemaVersion>(LicenseSchema.Versions);

			//this.InstallationTypes = LicenseDao.GetInstallationTypes();
			CanFill = true;
			this.DisplayView<CustomersListView>();
		}
		public string SearchKey {
			get { return mySearchKey; }
			set {
				mySearchKey = value;
				this.LoadCustomers();
			}
		}
		public void LoadCustomers() {
			this.Customers = this.LicenseDao.GetCustomers(this.SearchKey);
			//MLI 2017-11-29: Search by ContractNo
			if (Customers == null || Customers.Count == 0) {
				//MLI 2017-11-29: Search by ContractNo
				Customers = LicenseDao.GetCustomersByContractNo(SearchKey);
			}
			if (Customers == null || Customers.Count == 0) {
				//MLI 2017-11-29: Search by PropertyName
				Customers = LicenseDao.GetCustomersByPropertyName(SearchKey);
			}

			//MLI 2017-11-29: ResetData
			NewModulePropertyExpiryDate = DateTime.Now;
			NewModulePropertyLicenceCount = 0;
			NewModulePropertyTestLicenceCount = 1;
			SelectedNewModuleProperty = null;
			SelectedNewModule = null;

			this.DisplayView<CustomersListView>();
		}
		//MLI 2017-12-29: AddTempLicenses
		internal void SetAddTempLicenseCount(string p_Value) {
			if (string.IsNullOrEmpty(p_Value)) p_Value = "0";
			CurrentProject.XtendedLicenseCount = IntParser.Parse(p_Value);
		}
		//MLI 2017-12-29: AddTempLicenses
		internal string GetAddTempLicenseExpirationDate() {
			string result = string.Empty;
			result = CurrentProject.XtendedFinishDate.ToShortDateString();
			return (result);
		}

		internal string GetAddTempLicenseStartDate() {
			string result = string.Empty;
			result = CurrentProject.XtendedStartDate.ToShortDateString();
			return (result);
		}

		//MLI 2017-12-29: AddTempLicenses
		internal void SetAddTempLicenseExpirationDate(string p_Value) {
			//CurrentProject.AddTempLicenseExpirationDate = DateTimeParser.Parse(p_Value);
			CurrentProject.XtendedFinishDate = DateTimeParser.Parse(p_Value);
		}

		internal void OnChange_tempStartDate(string p_Value) {
			if (DateTimeParser.Parse(p_Value) > CurrentProject.XtendedFinishDate) {
				throw new Error(Resources.E_StartDateBiggerEndDate());
			} else {
				SetAddTempLicenseStartDate(p_Value);
			}
		}

		internal void SetAddTempLicenseStartDate(string p_Value) {
			//CurrentProject.AddTempLicenseStartDate = DateTimeParser.Parse(p_Value);
			CurrentProject.XtendedStartDate = DateTimeParser.Parse(p_Value);
		}
		//MLI 2017-12-29: AddTempLicenses
		internal string GetAddTempLicenseCount() {
			string result = string.Empty;
			//result = CurrentProject.AddTempLicenseCount.GetValeuOrDefault().ToString("N0");
			result = CurrentProject.XtendedLicenseCount.ToString("N0");
			return (result);
		}

		internal void OnChange_tempExpirationDate(string p_Value) {
			if (DateTimeParser.Parse(p_Value) < CurrentProject.XtendedStartDate) {
				throw new Error(Resources.E_EndDateSmallerStartDate());
			} else {
				SetAddTempLicenseExpirationDate(p_Value);
			}
		}

		internal bool OnDisplayed_TempLicensesDates() {
			bool result = false;
			result = CurrentProject.XtendedLicenseCount > 0;
			return (result);
		}
		// GKY 2019-04-09: Modulanzahlcounter
		internal int GetNumberofModulesinCurrentProjekt() {
			if (this.CurrentProject != null) {
				CurrentProjectModulcounter = 0;
				if (this.CurrentProject.ModuleProperties != null) {
					CurrentProjectModulcounter = this.CurrentProject.ModuleProperties.Count();
				}
			} else {
				CurrentProjectModulcounter = 0;
			}
			return CurrentProjectModulcounter;
		}
		//MLI 2017-11-30: Module search
		internal void OnChange_SearchModuleName(string p_Value) {
			SearchModuleName = p_Value;
			if (!string.IsNullOrEmpty(p_Value)) {
				SelectedNewModule = null;

				ModuleProperties = ModuleDao.GetModulePropertiesByName(p_Value, CurrentProject.ID);
				if (ModuleProperties.Count == 1) {
					SelectedNewModuleProperty = ModuleProperties[0];
					// OnChange_Property(SelectedNewModuleProperty);
					// SaveProjectModuleProperty(null);
				}
			} else {
				ModuleProperties = null;
			}
		}

		public void NavigateEditCustomer(int customerID) {
			if (customerID == 0) {
				this.CurrentCustomer = new Customer();
				CurrentCustomerShown = true;
				ProjectsShown = false;
				this.CurrentProject = null;
				this.Projects = null;
				this.Installations = null;
			} else {
				this.CurrentCustomer = this.LicenseDao.GetCustomer(customerID);
				if (this.CurrentCustomer == null) {
					this.LoadCustomers();
					throw new Error(Resources.SomebodyElseDeletedTheRecord());
				}
				var projects = this.LicenseDao.GetProjectsByCustomer(this.CurrentCustomer.ID);
				var installations = this.LicenseDao.GetInstallationsByCustomer(this.CurrentCustomer.ID);
				this.Projects = projects.Select(project => new TreeWrapper<Project, Installation> {
					Node = project,
					Expanded = false,
					Children = installations.Where(installation => installation.ProjectID == project.ID).ToList()
				}).ToList();
			}

			if (GetNumberofModulesinCurrentProjekt() != 0) {
				CurrentProjectModulcounter = 0;
			}
			CurrentCustomerShown = true;
			ProjectsShown = true;
			DisplayView<CustomersEditView>();
		}
		//MLI 2017-11-29: Fill property data
		internal void OnChange_Property(ModuleProperty p_Value) {
			SelectedNewModuleProperty = p_Value;
			SearchModuleName = p_Value.PropertyName.ToString();
			FillData();
		}

		public bool CanUserEditCustomer {
			get { return this.Client.CurrentPrincipal.IsInRole("Gen3EditCustomer"); }
		}
		public void ResetCurrentCustomer() {
			if (CurrentCustomer != null) {
				var original = this.LicenseDao.GetCustomer(CurrentCustomer.ID);
				this.CurrentCustomer = original == null ? new Customer() : original;
			}
		}
		public void DeactivateCurrentCustomer() {
			var Customer = LicenseDao.GetCustomer(CurrentCustomer.CustomerNo);
			if (!Session.Update(Customer)) throw new Error(Resources.CustomerNoIsMandatory()); //TODO
			LicenseDao.LogEntry(CurrentCustomer.ID, MessageTypes.CustomerCreated, "Customer deavtivated by '" + Client.CurrentPrincipal.Identity.Name + "'.");
		}

		public void SaveCurrentCustomer() {
			if (string.IsNullOrEmpty(CurrentCustomer.CustomerNo)) throw new Error(Resources.CustomerNoIsMandatory());
			else CurrentCustomer.CustomerNo = CurrentCustomer.CustomerNo.Trim();
			if (string.IsNullOrEmpty(CurrentCustomer.Name1)) throw new Error(Resources.CustomerNameIsMandatory());
			if (string.IsNullOrEmpty(CurrentCustomer.DefaultEMail)) throw new Error(Resources.CustomerEMailIsMandatory());
			if (CurrentCustomer.CustomerNo.Length > 64) throw new Error(Resources.CustomerNoHasOnlyNCharachters(64));
			if (CurrentCustomer.Name1.Length > 256) throw new Error(Resources.CustomerName1HasOnlyNCharachters(256));
			if (!string.IsNullOrEmpty(CurrentCustomer.Name2) && CurrentCustomer.Name2.Length > 256) throw new Error(Resources.CustomerName2HasOnlyNCharachters(256));
			if (!string.IsNullOrEmpty(CurrentCustomer.Address) && CurrentCustomer.Address.Length > 256) throw new Error(Resources.CustomerAddressHasOnlyNCharachters(256));
			if (!string.IsNullOrEmpty(CurrentCustomer.City) && CurrentCustomer.City.Length > 256) throw new Error(Resources.CustomerCityHasOnlyNCharachters(256));
			if (CurrentCustomer.DefaultEMail.Length > 256) throw new Error(Resources.CustomerDefaulteMailHasOnlyNCharachters(256));
			if (CurrentCustomer.ID == 0) {
				var testCustomer = LicenseDao.GetCustomer(CurrentCustomer.CustomerNo);
				if (testCustomer != null) throw new Error(Resources.CustomerNoAlreadyExists(testCustomer.Name1));
				Session.Insert(CurrentCustomer);
				LicenseDao.LogEntry(CurrentCustomer.ID, MessageTypes.CustomerCreated, "Customer created by '" + Client.CurrentPrincipal.Identity.Name + "'.");
			} else {
				if (!Session.Update(CurrentCustomer)) throw new Error(Resources.SomebodyElseModifiedTheRecord());
				LicenseDao.LogEntry(CurrentCustomer.ID, MessageTypes.CustomerModified, "Customer modified by '" + Client.CurrentPrincipal.Identity.Name + "'.");
			}
			this.NavigateEditCustomer(CurrentCustomer.ID);
		}

		internal bool OnDisplayed_EditFields(bool p_ReadOnly) {
			bool result = false;
			result = CanUserEditProject
			  && !p_ReadOnly
			  && (SelectedNewModule != null
				  || (ModuleProperties != null
					  && ModuleProperties.Count > 0));

			FillData();

			return (result);
		}

		public void NavigateEditProject(int projectID) {
			if (projectID == 0) {
				this.CurrentProject = new Project() {
					CustomerID = CurrentCustomer.ID,
					EMail = CurrentCustomer.DefaultEMail,
				};
				Installations = null;
				this.Modules = ModuleDao.GetModules();
			} else {
				this.CurrentProject = this.LicenseDao.GetProject(projectID);
				if (this.CurrentProject == null) {
					this.LoadCustomers();
					throw new Error(Resources.SomebodyElseDeletedTheRecord());
				}
				this.Modules = ModuleDao.GetModules(this.CurrentProject.ProjectType);
				this.CurrentProject.ModuleProperties = LicenseDao.GetProjectModuleProperties(this.CurrentProject.ID);
				Installations = this.LicenseDao.GetInstallationsByProject(this.CurrentProject.ID);
				GetNumberofModulesinCurrentProjekt();
			}



			DisplayView<ProjectsEditView>();
		}
		public bool CanUserEditProject {
			get { return this.Client.CurrentPrincipal.IsInRole("Gen3EditProject"); }
		}
		//MLI 2017-11-29: Save all
		public bool HasAllChanges { get; private set; }
		public void DeactivateCurrentInstallation() {
			var Customer = LicenseDao.GetCustomer(CurrentCustomer.CustomerNo);
			if (!Session.Update(Customer)) throw new Error(Resources.CustomerNoIsMandatory());//TODO
			LicenseDao.LogEntry(CurrentCustomer.ID, MessageTypes.CustomerCreated, "Project deactivated by '" + Client.CurrentPrincipal.Identity.Name + "'.");
		}
		public void ResetCurrentProject() {
			if (CurrentProject.ID == 0) {
				CurrentProject = LicenseDao.GetProject(CurrentProject.ID);
			}
		}
		public void SaveCurrentProject() {
			if (string.IsNullOrEmpty(CurrentProject.Description)) throw new Error(Resources.ProjectDescriptionIsMandatory());
			if (string.IsNullOrEmpty(CurrentProject.EMail)) throw new Error(Resources.ProjectEMailIsMandatory());
			if (string.IsNullOrEmpty(CurrentProject.NotifyEMail)) throw new Error(Resources.ProjectNotifyEMailIsMandatory());
			if (CurrentProject.Description.Length > 256) throw new Error(Resources.ProjectDescriptionHasOnlyNCharachters(256));
			if (!string.IsNullOrEmpty(CurrentProject.ContractNo) && CurrentProject.ContractNo.Length > 64) throw new Error(Resources.ProjectContractNoHasOnlyNCharachters(64));
			else CurrentProject.ContractNo = CurrentProject.ContractNo.Trim();// GKY Trimming the spaces in ContractNo 2019-09-26  
			if (CurrentProject.ID == 0) {
				var testProject = LicenseDao.GetProject(CurrentProject.ContractNo);
				if (testProject != null) throw new Error(Resources.ContractNoAlreadyExists(testProject.Description, testProject.Customer.Name1));
				if (CurrentProject.ExpiryInMonths.GetValueOrDefault() > 0) CurrentProject.ExpiryDate = DateTime.Now;
				Session.Insert(CurrentProject);
				LicenseDao.LogEntry(CurrentCustomer.ID, CurrentProject.ID, MessageTypes.ProjectCreated, "Project created by '" + Client.CurrentPrincipal.Identity.Name + "'.");
			} else {
				if (!Session.Update(CurrentProject)) throw new Error(Resources.SomebodyElseModifiedTheRecord());
				LicenseDao.LogEntry(CurrentCustomer.ID,
				  CurrentProject.ID,
				  MessageTypes.ProjectModified,
				  "Project modified by '" + Client.CurrentPrincipal.Identity.Name + "'.",
				  "PROD-LicenseCount is " + CurrentProject.ProductiveLicenseCount.ToString() + "\nTEST-LicenseCount is " + CurrentProject.TestLicenseCount.ToString());
			}

			//Switched those two function to fix the bug of not saving all modules when saving the project
			this.SaveAllProjectModuleProperties();
			this.NavigateEditProject(CurrentProject.ID);


		}

		internal void OnChecked_CanFill(bool p_Value) {
			CanFill = p_Value;
			//CanFill = true;

			FillData();
		}

		public void NavigateLogEntries() {
			if (CurrentProject != null) {
				this.LogEntries = LicenseDao.GetLogEntries(CurrentCustomer.ID, CurrentProject.ID, null, null);
			} else {
				this.LogEntries = LicenseDao.GetLogEntries(CurrentCustomer.ID, null, null, null);
			}
			if (this.LogEntries.Count > 200) this.LogEntries.RemoveRange(201, this.LogEntries.Count - 202);
			if (this.LogEntries.Count > 0) DisplayView<LogEntriesView>();
		}
		//MLI 2017-12-29:  Color-Styles
		internal StyleCombination GetColorByLiveCount(ProjectModuleProperty p_ModuleProperties) {
			StyleCombination result = null;
			if (p_ModuleProperties.ProductiveLicenseCount < 1) {
				result = new Style {
					ActiveBackColor = Color.Coral,
					BackgroundColor = Color.Red,
					DisabledBackColor = Color.Coral,
					ActiveForeColor = Color.Black,
					ForegroundColor = Color.White,
					DisabledForeColor = Color.Black,
				};
			} else if (p_ModuleProperties.ProductiveLicenseCount != CurrentProject.ProductiveLicenseCount) {
				result = new Style {
					ActiveBackColor = Color.LightYellow,
					DisabledBackColor = Color.LightYellow,
					DisabledForeColor = Color.Black,
					BackgroundColor = Color.Yellow,
					ActiveForeColor = Color.Black,
					ForegroundColor = Color.Black,

				};
			}

			return (result);
		}

		internal string GetNumberStringFormat(int? p_Value) {
			string result = string.Empty;
			if (p_Value.HasValue) {
				result = p_Value.Value.ToString("N0");
			}

			return (result);
		}

		//MLI 2017-12-29:  Color-Styles
		internal StyleCombination GetColorByDate(DateTime? p_Date) {
			StyleCombination result = null;
			if (p_Date < DateTime.Now.Date) {
				result = new Style {
					ActiveBackColor = Color.Coral,
					BackgroundColor = Color.Red,
					ActiveForeColor = Color.Black,
					ForegroundColor = Color.White,
					DisabledBackColor = Color.Coral,
					DisabledForeColor = Color.Black,
				};
			} else if (p_Date < DateTime.Now.Date.AddDays(7)) {
				result = new Style {
					ActiveBackColor = Color.LightYellow,
					BackgroundColor = Color.Yellow,
					ActiveForeColor = Color.Black,
					ForegroundColor = Color.Black,
					DisabledBackColor = Color.LightYellow,
					DisabledForeColor = Color.Black,
				};
			}

			return (result);
		}
		//MLI 2017-12-29:  Color-Styles
		internal StyleCombination GetColorByDate() {
			StyleCombination result = null;
			if (CurrentProject.ExpiryDate.Date < DateTime.Now.Date) {
				result = new Style {
					ActiveBackColor = Color.Coral,
					BackgroundColor = Color.Red,
					ActiveForeColor = Color.Black,
					ForegroundColor = Color.White,
					DisabledBackColor = Color.Coral,
					DisabledForeColor = Color.Black,
				};
			} else if (CurrentProject.ExpiryDate.Date < DateTime.Now.Date.AddDays(7)) {
				result = new Style {
					ActiveBackColor = Color.LightYellow,
					BackgroundColor = Color.Yellow,
					ActiveForeColor = Color.Black,
					ForegroundColor = Color.Black,
					DisabledBackColor = Color.LightYellow,
					DisabledForeColor = Color.Black,
				};
			}

			return (result);
		}

		//MLI 2017-12-29:  Color-Styles
		internal StyleCombination GetColorByTestCount(ProjectModuleProperty p_ModuleProperties) {
			StyleCombination result = null;
			if (p_ModuleProperties.TestLicenseCount < 1) {
				result = new Style {
					ActiveBackColor = Color.Coral,
					BackgroundColor = Color.Red,
					ActiveForeColor = Color.Black,
					ForegroundColor = Color.White,
					DisabledBackColor = Color.Coral,
					DisabledForeColor = Color.Black,
				};
			} else if (p_ModuleProperties.TestLicenseCount != CurrentProject.TestLicenseCount) {
				result = new Style {
					ActiveBackColor = Color.LightYellow,
					BackgroundColor = Color.Yellow,
					ActiveForeColor = Color.Black,
					ForegroundColor = Color.Black,
					DisabledBackColor = Color.LightYellow,
					DisabledForeColor = Color.Black,
				};
			}
			return (result);
		}
		//MLI 2017-12-29:  Color-Styles
		internal StyleCombination GetColorByModuleSearch(ProjectModuleProperty p_ProjectModuleProperty) {
			StyleCombination result = null;
			if (p_ProjectModuleProperty == null) return (result);
			if (p_ProjectModuleProperty.ModuleProperty == null) return (result);
			if (string.IsNullOrEmpty(SearchModuleName)) return (result);

			if ((!string.IsNullOrEmpty(p_ProjectModuleProperty.ModuleProperty.PropertyName)
					&& p_ProjectModuleProperty.ModuleProperty.PropertyName.ToUpper().Contains(SearchModuleName.ToUpper()))
				  || (!string.IsNullOrEmpty(p_ProjectModuleProperty.ModuleProperty.Description)
					&& p_ProjectModuleProperty.ModuleProperty.Description.ToUpper().Contains(SearchModuleName.ToUpper()))
				  ) {
				result = new Style {
					BackgroundColor = Color.LightGreen,
					ForegroundColor = Color.Black,
				};
			}
			return (result);
		}
		//MLI 2017-12-29:  Color-Styles
		internal StyleCombination GetColorByChanges() {
			StyleCombination result = null;
			if (HasAllChanges) {
				result = new Style {
					BackgroundColor = Color.LightCoral,
					ForegroundColor = Color.Black,
				};
			} else if (HasAllChanges) {
				result = new Style {
					BackgroundColor = Color.LightGreen,
					ForegroundColor = Color.Black,
				};
			}

			return (result);
		}

		public string LicenceRequestToImport;
		public void ImportLicenseRequest(string value) {
			LicenseRequest request = null;
			try {
				var isDeveloper = false;
				var installation = LicenseDao.ImportLicenseRequest(value, out request, out isDeveloper);
				if (isDeveloper) throw new Error(Resources.DeveloperLicenseCantBeImported());

				LicenseDao.LogEntry(CurrentCustomer.ID, CurrentProject.ID, installation.ID, MessageTypes.InstallationImported, "Request imported by '" + Client.CurrentPrincipal.Identity.Name + "'.", value);
				NavigateEditProject(installation.ProjectID);

			} catch (LicenseRequestException ex) {
				switch (ex.Result) {
					case LicenseRequestResults.RequestCantBeParsed:
						throw new Error(Resources.RequestCantBeParsed());
					case LicenseRequestResults.ProjectNotFound:
						throw new Error(Resources.ProjectNotFound(request.ContractNumber));
					case LicenseRequestResults.ProjectGuidNotValid:
						throw new Error(Resources.ProjectGuidNotValid(request.ContractNumber, request.ProjectGuid.ToString()));
					case LicenseRequestResults.InstallationTypeNotFound:
						throw new Error(Resources.InstallationTypeNotFound(request.InstallationType));
					default:
						throw new Error(ex.Message);
				}
			}

		}

		public string PortableInstallationType;
		public int PortableVersion = 0;
		public void CreatePortableLicence() {
			if (String.IsNullOrEmpty(this.PortableInstallationType))
				throw new Error(Resources.InstallationTypeEmpty());

			try {
				var installation = LicenseDao.CreatePortableInstallation(CurrentProject.ID, this.PortableInstallationType, this.PortableVersion);

				NavigateEditProject(installation.ProjectID);

				this.PortableInstallationType = null;
				this.PortableVersion = 0;
			} catch (LicenseRequestException ex) {
				switch (ex.Result) {
					case LicenseRequestResults.ProjectNotFound:
						throw new Error(Resources.ProjectNotFound(CurrentProject.ContractNo));
					case LicenseRequestResults.InstallationTypeNotFound:
						throw new Error(Resources.InstallationTypeNotFound(this.PortableInstallationType));
					case LicenseRequestResults.NotPortableExists:
						throw new Error(Resources.NotPortableExists());
					default:
						throw new Error(ex.Message);
				}
			}
		}

		internal bool OnDisplayed_Save(ProjectModuleProperty p_Prop, bool p_ReadOnly) {
			bool result = false;

			result = CanUserEditProject
			  && !p_ReadOnly
			  && p_Prop.ProductiveLicenseCount >= 0
			  && p_Prop.TestLicenseCount >= 0
			  && p_Prop.ExpiryDate.Date >= DateTime.Now.Date;

			return (result);
		}
		public bool IsPendingInstallation(Installation installation) {
			return !installation.Portable && !string.IsNullOrEmpty(installation.PendingRequest) && string.IsNullOrEmpty(installation.LicensedRequest);
		}
		public bool IsLicensedInstallation(Installation installation) {
			return !installation.Portable && !string.IsNullOrEmpty(installation.LicensedRequest);
		}
		public bool IsPortableInstallation(Installation installation) {
			return installation.Portable;
		}
		public void ActivatePendingRequest(int installationID) {
			var installation = LicenseDao.GetInstallation(installationID);
			installation.LicensedRequest = installation.PendingRequest;
			installation.PendingRequest = null;
			Session.Update(installation);
			LicenseDao.LogEntry(CurrentCustomer.ID,
			  installation.ProjectID,
			  installation.ID,
			  MessageTypes.InstallationActivated,
			  "Pending Request activated by '" + Client.CurrentPrincipal.Identity.Name + "'.", "Location: "
				+ installation.LicensedRequestData.InstallationLocation + "\nHardwareKey: " + installation.LicensedRequestData.HardwareKey);
			NavigateEditProject(installation.ProjectID);
		}
		public void DeActivateLicensedRequest(int installationID) {
			Responses resp = ShowQuestionNotification(this, "Wirklich Deaktivieren?");
			switch (resp) {
				case Responses.NO:
					return;
				case Responses.YES:
					var installation = LicenseDao.GetInstallation(installationID);
					installation.LicensedRequest = null;
					Session.Update(installation);
					LicenseDao.LogEntry(CurrentCustomer.ID,
					  installation.ProjectID,
					  installation.ID,
					  MessageTypes.InstallationActivated,
					  "License (de)activated by '" + Client.CurrentPrincipal.Identity.Name + "'.", string.Empty);
					NavigateEditProject(installation.ProjectID);
					break;
				default:
					return;
			}
		}
		public void DeletePortableInstallation(int installationID) {
			var installation = LicenseDao.GetInstallation(installationID);
			Session.Delete(installation);
			LicenseDao.LogEntry(CurrentCustomer.ID,
			  installation.ProjectID,
			  installation.ID,
			  MessageTypes.InstallationDeleted,
			  "Portable license deleted by '" + Client.CurrentPrincipal.Identity.Name + "'.", "Installation type: " + installation.InstallationType);
			NavigateEditProject(installation.ProjectID);
		}
		public void CopyLicensedRequestToClipboard(int installationID) {
			var installation = LicenseDao.GetInstallation(installationID);
			var licenseKey = GetCurrentLicenseData(installationID);
			Client.SetClipboardText(licenseKey);
			LicenseDao.LogEntry(CurrentCustomer.ID, installation.ProjectID, installationID, MessageTypes.InstallationCopied, "License was copied by '" + Client.CurrentPrincipal.Identity.Name + "'.");
		}

		public void GetLicenseDataAndInstallation(
			int installationID,
			List<int> InstallationIds,
			out string eMailRecipients,
			out string eMailInternal,
			out List<string> licenseKeys,
			out List<string> installations,
			out int LicenseCount,
			out DateTime LicenseExpiration) {

			installations = new List<string>();
			licenseKeys = new List<string>();
			var uniqueinstallation = LicenseDao.GetInstallation(installationID);

			// Use just the single installation instead of the collection
			var installation = uniqueinstallation.InstallationType;
			var licenseKey = GetCurrentLicenseData(installationID);
			installations.Add(installation);
			licenseKeys.Add(licenseKey);

			eMailRecipients = string.IsNullOrEmpty(uniqueinstallation.Project.EMail)
				? CurrentCustomer.DefaultEMail
				: uniqueinstallation.Project.EMail;

			eMailInternal = string.IsNullOrEmpty(uniqueinstallation.Project.NotifyEMail)
				? CurrentCustomer.DefaultEMail
				: uniqueinstallation.Project.NotifyEMail;

			LicenseCount = uniqueinstallation.Project.ProductiveLicenseCount;
			LicenseExpiration = uniqueinstallation.Project.ExpiryDate;
		}


		public static Responses ShowEmailView(
			MiniFormsApplication p_App,
			List<int> InstallationIds,
			int installationID,
			string InstaVersion,
			Guid projectGuid,
			string contractNumber = "", // Added parameter for contract number
			string senderName = "", // Added parameter for sender name
			EQButtons p_Button = EQButtons.YES_NO,
			ViewSizes p_ViewSizes = ViewSizes.VS_0240x0320) {

			Responses response = Responses.NONE;

			LicensesApplication appInstance = new LicensesApplication();

			List<string> licenseKeys;
			List<string> installations;
			string eMailRecipients;
			string eMailInternal;
			int LicenseCount;
			DateTime LicenseExpiration;

			appInstance.GetLicenseDataAndInstallation(
				installationID,
				InstallationIds,
				out eMailRecipients,
				out eMailInternal,
				out licenseKeys,
				out installations,
				out LicenseCount,
				out LicenseExpiration
			);

			EResponseDelegate callback = new EResponseDelegate((Responses resp) => {
				response = resp;
			});

			EmailApplication emailApp = new EmailApplication(
				callback,
				InstaVersion,
				licenseKeys,
				installations,
				projectGuid,
				LicenseCount,
				LicenseExpiration,
				eMailRecipients,
				eMailInternal,
				contractNumber, // Pass contract number to EmailApplication
				senderName, // Pass sender name to EmailApplication
				p_Button,
				p_ViewSizes
			);

			p_App.RunApplication(
				emailApp,
				app => {
					app.ShowDialogEmail();
				});

			return response;
		}

		public void SetAutoAcceptRequests(Installation installation) {
			installation.AutoAcceptRequests = installation.AutoAcceptRequests ? false : true;
			var dbInstallation = LicenseDao.GetInstallation(installation.ID);
			Session.Update(installation);
			LicenseDao.LogEntry(installation.Project.Customer.ID, installation.Project.ID, installation.ID, MessageTypes.InstallationAutoAcceptedActivated, "Pending Auto-Accept " + (installation.AutoAcceptRequests ? "" : "(de)") + "activated by '" + Client.CurrentPrincipal.Identity.Name + "'.");
		}

		private string GetCurrentLicenseData(int installationID) {
			var installation = LicenseDao.GetInstallation(installationID);

			LicenseData license = new LicenseData {
				LicenseCount = installation.InstallationType == "PROD"
								? installation.Project.ProductiveLicenseCount
								: installation.Project.TestLicenseCount,
				UserData = null,
			};

			// Set ExpiryDate based on ExpiryInMonths or ExpiryDate
			if (installation.Project.ExpiryInMonths.HasValue) {
				license.ExpiryDate = DateTime.Now.Date.AddMonths(installation.Project.ExpiryInMonths.Value);
			} else {
				license.ExpiryDate = installation.Project.ExpiryDate;
			}

			var licenseKey = license.Encrypt(installation.LicensedRequestData);

			return licenseKey;
		}

		private void FillData() {
			if (CanFill) {
				NewModulePropertyLicenceCount = CurrentProject.ProductiveLicenseCount;
				NewModulePropertyTestLicenceCount = CurrentProject.TestLicenseCount;
				NewModulePropertyExpiryDate = CurrentProject.ExpiryDate;
			}
			//else
			//{
			//  if (NewModulePropertyLicenceCount== CurrentProject.ProductiveLicenseCount && NewModulePropertyTestLicenceCount== CurrentProject.TestLicenseCount)
			//  {
			//    NewModulePropertyExpiryDate = DateTime.Now;
			//    NewModulePropertyLicenceCount = 0;
			//    NewModulePropertyTestLicenceCount = 0;
			//  }
			//}
		}

		public void SetProjectType(StoredProjectType value) {
			CurrentProject.ProjectType = value.ProjectType;

			this.Modules = ModuleDao.GetModules(this.CurrentProject.ProjectType);

			if (Modules.Count == 0) {
				throw new Error(Resources.NoModulesVailable(value.ProjectType));
			}
		}

		public void SigningOff() {
			Responses resp = ShowQuestionNotification(this, "Wirklich abmelden?");
			switch (resp) {
				case Responses.NO:
					return;
				case Responses.YES:
					this.ExitApplication();
					break;
				default:
					return;
			}
		}

		public Responses ShowQuestionNotification(MiniFormsApplication p_App
			, string p_Question
			, QButtons p_Button = QButtons.YES_NO
			, ViewSizes p_ViewSizes = ViewSizes.VS_0240x0320) {
			Responses response = Responses.NONE;
			p_App.RunApplication(new QuestionApplication(p_Question, (r) => {
				response = r;
			}, p_Button, p_ViewSizes), app => {
				app.ShowDialog();
			});

			return response;
		}
	}
}
