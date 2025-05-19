using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.Emails {
	public class NeuKunde {
		public static string GetEmailBody(string ob, Guid ProjectGuid,
										  int LicenseCount, string PMhonorifics,
										  string ProjectManager,
										  string SenderName) {
			return $@"Sehr geehrte Damen und Herren,

vielen Dank, dass Sie sich für weitere Module und Lizenzen entschieden haben!
Gemäß der AB_{ob} wurde Ihnen eine neue Lizenz für Ihre neue L-mobile Anwendung generiert.
Die Lizenz ist aktuell für {LicenseCount} User gültig.

Die dazugehörigen und eindeutigen product-Key lauten:

Conctract number: {ob} 
Projects guid: {ProjectGuid} 

Diese Mail dient informativ und zur Bestätigung der Auslieferung der Lizenz – Sie müssen hier nicht selbstständig aktiv werden.
Diese Daten müssen bei der Installation der Software in der Konfigurationsdatei hinterlegt werden.
Die Installation wird von Ihrem Projektleiter durchgeführt.
Sollten Sie Fragen haben, können Sie sich gerne direkt an Ihre {PMhonorifics} {ProjectManager}  wenden.

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
