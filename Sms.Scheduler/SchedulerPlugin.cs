namespace Sms.Scheduler
{
	using Crm.Library.Configuration;
	using Crm.Library.Modularization;

	[Plugin(Requires = "Main,Crm.Service", ModuleId = "FLD00050")]
	public class SchedulerPlugin : Plugin
	{
		public static string PluginName = typeof(SchedulerPlugin).Namespace;
	

		public static class PermissionGroup
		{
			public const string Scheduler = "Scheduler";
		}
	
		public static class PermissionName
		{
			public const string SchedulerClient = "SchedulerClient";

			public const string AddProfile = "AddProfile";
			public const string EditProfile = "EditProfile";
			public const string DeleteProfile = "DeleteProfile";
			public const string CanSeeOtherUsersProfile = "CanSeeOtherUsersProfile";
		}
		
		public static class Settings
		{
			public static class DashboardCalendar
			{
				public static SettingDefinition<bool> ShowAbsencesInCalendar => new SettingDefinition<bool>("DashboardCalendar/ShowAbsencesInCalendar", PluginName);
			}
			public static class WorkingTime
			{
				public static SettingDefinition<int> FromDay => new SettingDefinition<int>("WorkingTime/FromDay", PluginName);
				public static SettingDefinition<int> ToDay => new SettingDefinition<int>("WorkingTime/ToDay", PluginName);
				public static SettingDefinition<int> FromHour => new SettingDefinition<int>("WorkingTime/FromHour", PluginName);
				public static SettingDefinition<int> ToHour => new SettingDefinition<int>("WorkingTime/ToHour", PluginName);
				public static SettingDefinition<int> MinutesInterval => new SettingDefinition<int>("WorkingTime/MinutesInterval", PluginName);
				public static SettingDefinition<bool> IgnoreWorkingTimesInEndDateCalculation => new SettingDefinition<bool>("WorkingTime/IgnoreWorkingTimesInEndDateCalculation", PluginName);

			}
			public static SettingDefinition<string[]> TechnicianRoles => new SettingDefinition<string[]>("TechnicianRoles", PluginName);
			public static SettingDefinition<int> ServiceOrderZipCodeAreaLength => new SettingDefinition<int>("ServiceOrderZipCodeAreaLength", PluginName);
			public static SettingDefinition<bool> DispatchesAfterReleaseAreEditable => new SettingDefinition<bool>("DispatchesAfterReleaseAreEditable", PluginName);
		}
	}
}
