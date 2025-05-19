using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Emails {
	public class TestModule {
		public static string GetEmailBody(DateTime LicenseExpiration,
										  int LicenseCount, string ProjectManager,
										  string SenderName, string addedmodules,
										  List<string> licenseKeys,
										  List<string> installations,
										  string PMhonorifics) {
			string formattedSoftwarepaketeString = string.Empty;

			if (!string.IsNullOrWhiteSpace(addedmodules)) {
				try {
					var softwarepaketeList = addedmodules.Split(',')
												 .Select(x => x.Trim())
												 .Where(x => !string.IsNullOrEmpty(x));
					formattedSoftwarepaketeString =
						string.Join(" und ", softwarepaketeList);
				} catch (Exception ex) {
					Console.WriteLine($"Error formatting softwarepakete: {ex.Message}");
				}
			}

			StringBuilder licenseDetails = new StringBuilder();
			if (licenseKeys != null && licenseKeys.Any() && installations != null &&
				installations.Any()) {
				var latestProdKey = string.Empty;
				var latestTestKey = string.Empty;
				var latestProdInstallation = string.Empty;
				var latestTestInstallation = string.Empty;

				for (int i = 0; i < licenseKeys.Count; i++) {
					var key = licenseKeys[i];
					var installation = installations[i];

					if (installation.Contains("PROD")) {
						latestProdKey = key;
						latestProdInstallation = installation;
					} else if (installation.Contains("TEST")) {
						latestTestKey = key;
						latestTestInstallation = installation;
					}
				}

				if (!string.IsNullOrEmpty(latestProdInstallation) &&
					!string.IsNullOrEmpty(latestProdKey)) {
					licenseDetails.AppendLine($"{latestProdInstallation}-System");
					licenseDetails.AppendLine($"{latestProdKey}");
					licenseDetails.AppendLine();
				}

				if (!string.IsNullOrEmpty(latestTestInstallation) &&
					!string.IsNullOrEmpty(latestTestKey)) {
					licenseDetails.AppendLine($"{latestTestInstallation}-System");
					licenseDetails.AppendLine($"{latestTestKey}");
					licenseDetails.AppendLine();
				}
			}

			return $@"
Sehr geehrte Damen und Herren,

vielen Dank, dass Sie sich für ein weiteres Modul interessieren!
Wie bereits mit Ihrem Ansprechpartner vereinbart, wurde Ihnen das Softwarepaket {formattedSoftwarepaketeString} für 8 Wochen (bis zum {LicenseExpiration}) zur Verfügung gestellt.
Die Module wurden Ihrer aktuellen Lizenz hinzugefügt.

Ebenfalls wurden die Anzahl der Userlizenzen bis zum {LicenseExpiration}  auf {LicenseCount} erhöht.

Sollte sich die Lizenz nicht automatisch erhöhen, können Sie folgende Lizenz-Key importieren:

{licenseDetails} 
Die Module sind nun aktiv. 
Die oben genannten Keys können Sie in der Anwendung unter „Lizenzdaten“ eintragen.
Dadurch wird das erworbene Softwarepaket in Ihre Anwendung hinzugefügt.
Sollten Sie Fragen haben, können Sie sich gerne direkt an Ihren {PMhonorifics} {ProjectManager} wenden.

Das L-mobile Team freut sich auf weitere erfolgreiche Zusammenarbeit und wünscht Ihnen einen schönen Tag!

Kind regards,
{SenderName}
Customer Support Manager

L-mobile solutions GmbH & Co. KG, Im Horben 7, D-71560 Sulzbach/Murr
T +49 (0) 7193 93 12-2605, F +49 (0) 7193 93 12-12, l-mobile.com

Are you interested in what we do with your data? Info at: l-mobile.com/datenschutzerklaerung

Follow us on Facebook, LinkedIn, YouTube, Xing, Instagram
            ";
		}
	}
}
