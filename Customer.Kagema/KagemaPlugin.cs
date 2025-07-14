using Crm.Library.Configuration;
using Crm.Library.Modularization;

namespace Customer.Kagema
{
    [Plugin(Requires = "Main,Crm.Service")]
    public class KagemaPlugin : CustomerPlugin
	{
		public static class Settings
		{
			public static string PluginName = "Customer.Kagema";
			public static SettingDefinition<string> NavisionWebserviceUrl => new SettingDefinition<string>("NavisionWebserviceUrl", PluginName);
			public static SettingDefinition<bool> EnableFileExport => new SettingDefinition<bool>("EnableFileExport", PluginName);
			public static SettingDefinition<string> NetworkDrivePathForFileStorage => new SettingDefinition<string>("NavisionWebserviceUrl", PluginName);
			public static SettingDefinition<string> ItemNoWithKilometerAmount => new SettingDefinition<string>("ItemNoWithKilometerAmount", PluginName);
			public static SettingDefinition<string> ItemNoForKilometer => new SettingDefinition<string>("ItemNoForKilometer", PluginName);
			public static SettingDefinition<bool> EnableStatusUpdateInBc => new SettingDefinition<bool>("EnableStatusUpdateInBc", PluginName);
			public static SettingDefinition<string> dummyArticleItemNo => new SettingDefinition<string>("dummyArticleItemNo", PluginName);
			public static SettingDefinition<string> LocationCode => new SettingDefinition<string>("LocationCode", PluginName);
		   	public static SettingDefinition<string> ShortcutDimensionCode => new SettingDefinition<string>("ShortcutDimensionCode", PluginName);
			 public static SettingDefinition<string> FAHRTWorkType => new SettingDefinition<string>("FAHRTWorkType", PluginName);

			public static SettingDefinition<string> ServiceOrderReportPath => new SettingDefinition<string>("ServiceOrderReportPath", PluginName);

			public static SettingDefinition<string> ServiceOrderReportPathNew => new SettingDefinition<string>("ServiceOrderReportPathNew", PluginName);

			public static SettingDefinition<string> UncUser => new SettingDefinition<string>("UncUser", PluginName);
			public static SettingDefinition<string> UncDomain => new SettingDefinition<string>("UncDomain", PluginName);
			public static SettingDefinition<string> UncPassword => new SettingDefinition<string>("UncPassword", PluginName);
			public static SettingDefinition<bool> DisableDispatchReportAttachments => new SettingDefinition<bool>("DisableDispatchReportAttachments", PluginName);
			public static class EnvironmentSettings
			{
				public static SettingDefinition<string> EnvironmentName => new SettingDefinition<string>("EnvironmentName", PluginName);
			}
		}



	}
}
