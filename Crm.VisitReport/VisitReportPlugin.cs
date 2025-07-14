namespace Crm.VisitReport
{
	using Crm.Library.Configuration;
	using Crm.Library.Modularization;

	[Plugin(ModuleId = "FLD03040", Requires = "Main,Crm.DynamicForms")]
	public class VisitReportPlugin : Plugin
	{
		public static readonly string PluginName = typeof(VisitReportPlugin).Namespace;

		public static class PermissionGroup
		{
			public const string Topic = "Topic";
			public const string Visit = "Visit";
			public const string VisitReport = "VisitReport";
		}
		public static class PermissionName
		{
			public const string VisitReportsTab = "VisitReportsTab";
			public const string VisitsTab = "VisitsTab";
			public const string TopicsTab = "TopicsTab";
			public const string AddContactPersonRelationship = "AddContactPersonRelationship";
			public const string Print = "Print";
			public const string SaveTopic = "SaveTopic";
			public const string EditAllUsersTourPlanning = "EditAllUsersTourPlanning";
			public const string EditAllUsersVisitReports = "EditAllUsersVisitReports";
			public const string SeeAllUsersTourPlanning = "SeeAllUsersTourPlanning";
			public const string SeeAllUsersVisitReports = "SeeAllUsersVisitReports";
			public const string ViewAllReporting = "ViewAllReporting";
			public const string SetStatus = "SetStatus";
		}

		public static class Settings
		{
			public static SettingDefinition<double> DefaultVisitTimeSpanHours => new SettingDefinition<double>("DefaultVisitTimeSpanHours", PluginName);
			public static class Visit
			{
				public static SettingDefinition<string[]> AvailableTimeUnits => new SettingDefinition<string[]>("Visit/AvailableTimeUnits", PluginName);
				public static SettingDefinition<bool> EditVisitAfterClosing => new SettingDefinition<bool>("Visit/EditVisitAfterClosing", PluginName);
			}
			public static SettingDefinition<bool> Prefill => new SettingDefinition<bool>("VisitReport/Prefill", PluginName);
		}
	}
}