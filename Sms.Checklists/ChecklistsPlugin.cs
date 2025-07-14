namespace Sms.Checklists
{
	using Crm.Library.Configuration;
	using Crm.Library.Modularization;

	[Plugin(ModuleId = "FLD03170", Requires = "Main,Crm.Service,Crm.DynamicForms")]
	public class ChecklistsPlugin : Plugin
	{
		public const string PluginName = "Sms.Checklists";
		public static class PermissionGroup
		{
			public const string ServiceCaseChecklist = "ServiceCaseChecklist";
			public const string ServiceOrderChecklist = "ServiceOrderChecklist";
			public const string ServiceOrderPdfChecklist = "ServiceOrderPdfChecklist";
		}
		public static class PermissionName
		{
			public const string AddChecklist = "AddChecklist";
			public const string AddPdfChecklist = "AddPdfChecklist";
			public const string ToggleRequired = "ToggleRequired";
		}

		public static class Settings
		{
			public static class Dispatch
			{
				public static SettingDefinition<bool> CustomerSignatureValidateChecklists => new SettingDefinition<bool>("Dispatch/CustomerSignatureValidateChecklists", PluginName);
			}
		}
	}
}
