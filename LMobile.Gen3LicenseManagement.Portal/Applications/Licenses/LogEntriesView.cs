using System.Globalization;
using System.Linq;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using LMobile.Gen3LicenseManagement.Portal.BusinessObjects;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;
using System.Collections.Generic;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Licenses {
	class LogEntriesView : ApplicationView<BaseView, LicensesApplication> {
		public readonly BindingSource<ProjectLog> LogEntries;
		public BindingSource<ProjectModuleProperty> ModuleProperties;
		public LogEntriesView() {
			this.LogEntries = this.CreateCollectionBindingSource(Application, app => app.LogEntries);
		}

		protected override void Render(BaseView master) {
			master.BackButton.BindAction(Application, app => app.NavigateEditProject(app.CurrentProject.ID));

			this.ModuleProperties = this.CreateCollectionBindingSource(Application, app => app.CurrentProject != null ? app.CurrentProject.ModuleProperties : new List<ProjectModuleProperty>());

			var scroller = master.Content.AddScrollPanel(Scrolling.Vertical).SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.H100);
			var main = scroller.Layout.AddLinesLayout().SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.Panel);

			#region Project - Edit
			var editor = main.AddProjectEditArea(Application, ModuleProperties, true);
			#endregion

			#region LogEntry-List
			var logEntries = main.AddLogEntryTable(Application, LogEntries).SetStyle(ClassicStyleSheet.W100 + ClassicStyleSheet.SectionBody);
			#endregion
		}
	}
}
