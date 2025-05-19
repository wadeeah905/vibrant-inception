using LMobile.Gen3LicenseManagement.Dao.BusinessObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Emails {
	public class NewModuleNewLicence {
		public static string GetEmailBody(string ob, int LicenseCount,
										  string SenderName, string addedmodules,
										  List<string> licenseKeys,
										  List<string> installations) {
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
				for (int i = 0; i < licenseKeys.Count; i++) {
					var key = licenseKeys[i];
					var installation = installations[i];

					licenseDetails.AppendLine($"{installation}-System");
					licenseDetails.AppendLine($"{key}");
					licenseDetails.AppendLine();
				}
			}

			return $@"
Sehr geehrte Damen und Herren,

vielen Dank, dass Sie sich für weitere Module entschieden haben!
Ich habe Ihrer Lizenz, gemäß der  AB_{ob} ,das Softwarepaket {formattedSoftwarepaketeString} hinzugefügt.
sowie in unserem GEN3-Lizenzportal auf {LicenseCount} Userlizenzen erhöht.
Die Lizenz auf Ihrem Server wird dadurch automatisch angepasst.

Sollte sich die Lizenz nicht automatisch erhöhen, können Sie folgende Lizenz-Key importieren:

{licenseDetails} 
Falls ich Sie beim Einspielen der Lizenz unterstützen kann oder sollten Sie Fragen haben, können Sie sich gerne an mich wenden.

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
