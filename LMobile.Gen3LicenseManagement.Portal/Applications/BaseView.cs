using System;
using System.Text;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;

namespace LMobile.Gen3LicenseManagement.Portal.Applications {
	public class BaseView : ClassicView23 {
		public BaseView() {
			Init(this);
		}
		public static void Init(View view) {
			view.DesignSize = new DesignSize(1200, 600, new DefaultFont(11));
		}
	}
}
