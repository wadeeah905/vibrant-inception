using System.Configuration;
using System.Linq;
using LMobile.Gida;
using LMobile.MiniForms;
using LMobile.Gen3LicenseManagement.Dao;
using LMobile.Gen3LicenseManagement.Dao.Contracts;
using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using LMobile.Gen3LicenseManagement.Portal.Applications.Login;

namespace LMobile.Gen3LicenseManagement.Portal {
	class Program {
		static void Main(string[] args) {
			new Service().Run(args);
		}
	}
	class Service : ServiceProcess {
		private MiniFormsListener myListener;
		protected override void OnStart(bool isService, string[] args) {
			if (bool.Parse(ConfigurationManager.AppSettings["StartSchemaCreator"])) {
				Gen3LicenseSchemaCreator.CreateSchema();
				
				var session = GidaConfiguration.Factories["LicenseManagement"].CurrentSession; 
				var licenseDao = session.GetService<ILicenseDao>();
				var projectTypes = licenseDao.GetProjectTypes();
				if (projectTypes.FirstOrDefault(pt => pt.ProjectType == "WAREHOUSE") == null) session.Insert(new StoredProjectType { ProjectType = "WAREHOUSE" });
				if (projectTypes.FirstOrDefault(pt => pt.ProjectType == "PRODUCTION") == null) session.Insert(new StoredProjectType { ProjectType = "PRODUCTION" });
				if (projectTypes.FirstOrDefault(pt => pt.ProjectType == "CRM") == null) session.Insert(new StoredProjectType { ProjectType = "CRM" });
				if (projectTypes.FirstOrDefault(pt => pt.ProjectType == "SERVICE") == null) session.Insert(new StoredProjectType { ProjectType = "SERVICE" });
				if (projectTypes.FirstOrDefault(pt => pt.ProjectType == "LOG 2.0") == null) session.Insert(new StoredProjectType { ProjectType = "LOG 2.0" });
				var installationTypes = licenseDao.GetInstallationTypes();
				if (installationTypes.FirstOrDefault(pt => pt.InstallationType == "PROD") == null) session.Insert(new StoredInstallationType { InstallationType = "PROD" });
				if (installationTypes.FirstOrDefault(pt => pt.InstallationType == "TEST") == null) session.Insert(new StoredInstallationType { InstallationType = "TEST" });
				if (installationTypes.FirstOrDefault(pt => pt.InstallationType == "DEMO") == null) session.Insert(new StoredInstallationType { InstallationType = "DEMO" });
			}

			var bundle = new MiniFormsBundle<LoginApplication>();
			bundle.Application = () => new LoginApplication();
			bundle.Startup = app => app.Start();
			myListener = new MiniFormsListener();
			myListener.Bundle = bundle;
			myListener.UseEncryption = true;
			myListener.Start();
		}
		protected override void OnStop() {
			if (myListener != null) myListener.Stop();
		}
	}
}
