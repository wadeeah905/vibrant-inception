using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Emails {
	public class NewLizenzIncreaseNum {
		public static string GetEmailBody(string ob, int LicenseCount,
										  string SenderName,
										  List<string> licenseKeys,
										  List<string> installations) {
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

			return $@"Sehr geehrte Damen und Herren,

vielen Dank, dass Sie sich für weitere Lizenzen entschieden haben!
Ich habe Ihre Lizenz gemäß der  AB_{ob} in unserem GEN3-Lizenzportal auf {LicenseCount} Userlizenzen erhöht.
Die Lizenz auf Ihrem Server wird dadurch automatisch angepasst.

Sollte sich die Lizenz nicht automatisch erhöhen, können Sie folgende Lizenz-Key importieren:

{licenseDetails} 
Falls ich Sie beim Einspielen der Lizenz unterstützen kann oder sollten Sie Fragen haben, können Sie sich gerne an mich wenden.
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
