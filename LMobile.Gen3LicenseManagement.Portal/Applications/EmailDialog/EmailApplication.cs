

using LMobile.Gen3LicenseManagement.Portal.Applications.QuestionDialog;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Drawing;
using System.Net.Mail;
using System.ComponentModel;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using System.Security.Policy;
using LMobile.Gen3LicenseManagement.Portal.Applications.Emails; // Added missing namespace import

namespace LMobile.Gen3LicenseManagement.Portal.Applications.EmailDialog {
	public enum EQButtons {
		OK_BACK = 0,
		YES_NO = 1,
		YES_NO_CANCEL = 2
	}

	// Email template types as an enum for better control flow
	public enum EmailTemplateType {
		None,
		NeukundeGEN3,
		IncreaseUserLicenses,
		AddModule,
		TestInstallation,
		InventurTemporar,
		TestModul,
		NewModuleNewLicense
	}

	public delegate void ReturnValueDelegate(object value);
	public delegate void EResponseDelegate(Responses response);

	class EmailApplication : BaseApplication {

		public bool IsEmailTextAreaEnabled { get; set; }

		public string LicenseKey { get; set; }
		public int LicenseCount { get; set; }
		public DateTime LicenseExpiration { get; set; }
		public string PMhonorifics { get; set; }
		public string eMailInternal { get; set; }
		public string eMailRecipients { get; set; }
		public string InstaVersion { get; set; }
		public Installation Installation { get; set; }
		public Guid ProjectGuid { get; set; }
		public string ContractNumber { get; set; } // Added to store the contract number from the project

		// Button determines which buttons are displayed in the dialog (OK/BACK, YES/NO, or YES/NO/CANCEL)
		public EQButtons Button { get; set; }
		public EResponseDelegate CallBack { get; set; }
		public string ContractNoEmail { get; set; }
		public bool IsRowEnabled => CurrentTemplate == EmailTemplateType.AddModule;

		private string _projectManager;
		public string ProjectManager {
			get => _projectManager;
			set {
				if (_projectManager != value) {
					_projectManager = value;
					RefreshEmailBody();
				}
			}
		}

		private string _modulesAdded;
		public string ModulesAdded {
			get => _modulesAdded;
			set {
				if (_modulesAdded != value) {
					_modulesAdded = value;
					RefreshEmailBody();
				}
			}
		}

		private string _senderName;
		public string SenderName {
			get => _senderName;
			set {
				if (_senderName != value) {
					_senderName = value;
					RefreshEmailBody();
				}
			}
		}

		private string _obNumber;
		public string ObNumber {
			get => _obNumber;
			set {
				if (_obNumber != value) {
					_obNumber = value;
					RefreshEmailBody();
				}
			}
		}

		private EmailTemplateType _currentTemplate = EmailTemplateType.None;
		public EmailTemplateType CurrentTemplate {
			get => _currentTemplate;
			set {
				if (_currentTemplate != value) {
					_currentTemplate = value;
					UpdateEmailBodyByTemplate(value);
				}
			}
		}

		// For UI binding compatibility
		public string SelectedTemplate {
			get => GetLocalizedTemplateName(CurrentTemplate);
			set {
				var template = GetTemplateTypeFromLocalizedName(value);
				if (CurrentTemplate != template) {
					CurrentTemplate = template;
					UpdateEmailBodyByTemplate(template);
				}
			}
		}

		public void ToggleEmailTextArea() {
			if (!string.IsNullOrWhiteSpace(ObNumber) &&
				CurrentTemplate != EmailTemplateType.None &&
				!string.IsNullOrWhiteSpace(ProjectManager) &&
				!string.IsNullOrWhiteSpace(SenderName)) {

				IsEmailTextAreaEnabled = true;
			} else {
				IsEmailTextAreaEnabled = false;
			}

			// Manually trigger UI refresh since PropertyChanged is removed
			RefreshView();
		}

		public List<string> HerrFrau { get; set; } = new List<string> {
			Resources.@Herr(), Resources.@Frau()
		};

		public void SetHerrFrauChoice(string selectedHerrFrau) {
			if (selectedHerrFrau == Resources.@Herr()) {
				PMhonorifics = Resources.@ProjektleiterHerr();
				RefreshEmailBody();
			} else if (selectedHerrFrau == Resources.@Frau()) {
				PMhonorifics = Resources.@ProjektleiterinFrau();
				RefreshEmailBody();
			} else {
				PMhonorifics = Resources.@ProjektleiterProjektleiterin();
			}
		}

		// ViewSize determines the dimensions of the dialog window
		public ViewSizes ViewSize {
			get;
			private set;
		}

		private void RefreshEmailBody() {
			if (CurrentTemplate != EmailTemplateType.None) {
				UpdateEmailBodyByTemplate(CurrentTemplate);
				// Call RefreshView instead of PropertyChanged to update UI
				RefreshView();
			}
		}

		public void CustomSendEmail() {
			string fromAddress = Resources.@FromAddress();
			string subject = Resources.@EmailSubject();
			string body = this.ContractNoEmail;

			try {
				MailMessage mail = new MailMessage {
					From = new MailAddress(fromAddress),
					Subject = subject,
					Body = body,
					IsBodyHtml = false
				};

				if (!string.IsNullOrWhiteSpace(this.eMailRecipients)) {
					foreach (var recipient in this.eMailRecipients.Split(';')) {
						mail.To.Add(recipient.Trim());
					}
				}

				if (!string.IsNullOrWhiteSpace(this.eMailInternal)) {
					foreach (var cc in this.eMailInternal.Split(';')) {
						mail.CC.Add(cc.Trim());
					}
				}

				using (SmtpClient smtpClient = NetworkConfiguration.CreateSmtpClient()) {
					smtpClient.Send(mail);
				}
				SendResponse(Responses.NO);
			} catch (Exception ex) {
				Console.WriteLine($"Failed to send email: {ex.Message}");
			}
		}

		public List<string> LicenseKeys { get; set; }
		public List<string> Installations { get; set; }

		public EmailApplication(
		EResponseDelegate callback,
		string InstaVersion,
		List<string> licenseKeys,
		List<string> installations,
		Guid projectGuid,
		int LicenseCount,
		DateTime LicenseExpiration,
		string eMailRecipients,
		string eMailInternal,
		string contractNumber = "", // Added parameter for contract number
		string senderName = "",     // Added parameter for sender name
		EQButtons button = EQButtons.YES_NO,
		ViewSizes p_ViewSize = ViewSizes.VS_0240x0320) {
			this.CallBack = callback;
			this.LicenseKeys = licenseKeys;
			this.Installations = installations;
			this.ProjectGuid = projectGuid;
			this.InstaVersion = InstaVersion;
			this.eMailRecipients = eMailRecipients;
			this.eMailInternal = eMailInternal;
			this.Button = button;
			this.ViewSize = p_ViewSize;
			this.LicenseCount = LicenseCount;
			this.LicenseExpiration = LicenseExpiration;

			// Set the contract number and sender name if provided
			this.ContractNumber = contractNumber;
			this.ObNumber = contractNumber; // Auto-populate OB number with contract number
			this.SenderName = string.IsNullOrEmpty(senderName) ?
				Client.CurrentPrincipal?.Identity?.Name : senderName; // Use current user if not specified
		}

		private void UpdateEmailBodyByTemplate(EmailTemplateType templateType) {
			Guid projectGuid = ProjectGuid;
			string ob = this.ObNumber;
			string addedmodules = ModulesAdded;

			switch (templateType) {
				case EmailTemplateType.NeukundeGEN3:
					ContractNoEmail = NeuKunde.GetEmailBody(ob, projectGuid, LicenseCount, PMhonorifics, ProjectManager, SenderName);
					break;

				case EmailTemplateType.IncreaseUserLicenses:
					ContractNoEmail = NewLizenzIncreaseNum.GetEmailBody(ob, LicenseCount, SenderName, LicenseKeys, Installations);
					break;

				case EmailTemplateType.AddModule:
					ContractNoEmail = AddModule.GetEmailBody(ob, SenderName, addedmodules, LicenseKeys, Installations);
					break;

				case EmailTemplateType.TestInstallation:
					ContractNoEmail = NewTestInstallation.GetEmailBody(ob, projectGuid, LicenseCount, LicenseExpiration, ProjectManager, SenderName, PMhonorifics);
					break;

				case EmailTemplateType.InventurTemporar:
					ContractNoEmail = InventurTemp.GetEmailBody(ob, LicenseCount, SenderName, LicenseKeys, Installations);
					break;

				case EmailTemplateType.TestModul:
					ContractNoEmail = TestModule.GetEmailBody(LicenseExpiration, LicenseCount, ProjectManager, SenderName, addedmodules, LicenseKeys, Installations, PMhonorifics);
					break;

				case EmailTemplateType.NewModuleNewLicense:
					ContractNoEmail = NewModuleNewLicence.GetEmailBody(ob, LicenseCount, SenderName, addedmodules, LicenseKeys, Installations);
					break;

				default:
					ContractNoEmail = NeuKunde.GetEmailBody(ob, projectGuid, LicenseCount, PMhonorifics, ProjectManager, SenderName);
					break;
			}
		}

		// Get localized template names for UI display
		public List<string> EmailTemplates => new List<string> {
			"",
			Resources.@NeueLizenzNeuKunde(),
			Resources.@NeueLizenzIncreaseNumberUser(),
			Resources.@NeueLizenzAddModul(),
			Resources.@NeueLizenzTestInstallation(),
			Resources.@NeueLizenzInventurTemporar(),
			Resources.@NeuLizenzTestmodul(),
			Resources.@NeuLizenzNeueModulUndBenuzter()
		};

		private string GetLocalizedTemplateName(EmailTemplateType templateType) {
			switch (templateType) {
				case EmailTemplateType.NeukundeGEN3:
					return Resources.@NeueLizenzNeuKunde();
				case EmailTemplateType.IncreaseUserLicenses:
					return Resources.@NeueLizenzIncreaseNumberUser();
				case EmailTemplateType.AddModule:
					return Resources.@NeueLizenzAddModul();
				case EmailTemplateType.TestInstallation:
					return Resources.@NeueLizenzTestInstallation();
				case EmailTemplateType.InventurTemporar:
					return Resources.@NeueLizenzInventurTemporar();
				case EmailTemplateType.TestModul:
					return Resources.@NeuLizenzTestmodul();
				case EmailTemplateType.NewModuleNewLicense:
					return Resources.@NeuLizenzNeueModulUndBenuzter();
				default:
					return "";
			}
		}

		private EmailTemplateType GetTemplateTypeFromLocalizedName(string localizedName) {
			if (localizedName == Resources.@NeueLizenzNeuKunde())
				return EmailTemplateType.NeukundeGEN3;
			if (localizedName == Resources.@NeueLizenzIncreaseNumberUser())
				return EmailTemplateType.IncreaseUserLicenses;
			if (localizedName == Resources.@NeueLizenzAddModul())
				return EmailTemplateType.AddModule;
			if (localizedName == Resources.@NeueLizenzTestInstallation())
				return EmailTemplateType.TestInstallation;
			if (localizedName == Resources.@NeueLizenzInventurTemporar())
				return EmailTemplateType.InventurTemporar;
			if (localizedName == Resources.@NeuLizenzTestmodul())
				return EmailTemplateType.TestModul;
			if (localizedName == Resources.@NeuLizenzNeueModulUndBenuzter())
				return EmailTemplateType.NewModuleNewLicense;

			return EmailTemplateType.None;
		}

		public void SetTemplateChoice(string selectedTemplate) {
			SelectedTemplate = selectedTemplate;
			RefreshView();
		}

		public void ShowDialogEmail() { DisplayView<EmailView>(); }

		public void SendResponse(Responses response) {
			string contractNumber = this.ContractNoEmail;
			this.CallBack.Invoke(response);
			this.ExitApplication();
		}

		internal StyleCombination RightNavigationStyle() {
			return ClassicStyleSheet.W100;
		}

		internal StyleCombination RightNavigationButtonStyle() {
			StyleCombination result = new StyleCombination();

			result = new Style() {
				BorderColor = Color.FromArgb(0xE6, 0xE6, 0xE6),
				RightBorder = new Length(1, LengthUnit.Pixels),
			};
			return (result);
		}
	}
}