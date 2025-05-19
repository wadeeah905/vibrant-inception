using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;
using System.Timers;
using LMobile.MiniForms;
using LMobile.MiniForms.Classic;
using LMobile.Gen3LicenseManagement.Portal.Applications;

namespace LMobile.Gen3LicenseManagement.Portal.Applications.QuestionDialog {
	public enum QButtons { OK_BACK = 0, YES_NO = 1, YES_NO_CANCEL = 2 }
	public enum Responses { NONE = 0, OK = 1, BACK = 2, YES = 3, NO = 4, CANCEL = 5 }

	public enum ViewSizes { VS_0240x0320 = 1, VS_0800x0600 = 2, VS_1250x0800 = 4, VS_1376x0768 = 8, VS_1600x0900 = 16 }

	public delegate void ReturnValueDelegate(object value);
	public delegate void ResponseDelegate(Responses response);

	class QuestionApplication : BaseApplication {
		public QButtons Button { get; set; }
		public ResponseDelegate CallBack { get; set; }
		public string Question { get; set; }
		public ViewSizes ViewSize { get; private set; }

		public QuestionApplication(string question, ResponseDelegate callback, QButtons button = QButtons.YES_NO,
								   ViewSizes p_ViewSize = ViewSizes.VS_0240x0320) {
			this.Question = question;
			this.Button = button;
			this.CallBack = callback;
			ViewSize = p_ViewSize;
			// SetCurrentViewSize(p_ViewSize);
		}

		public void ShowDialog() {
			DisplayView<QuestionView>();
		}

		public void SendResponse(Responses response) {
			this.CallBack.Invoke(response);
			this.ExitApplication();
		}

		internal StyleCombination RightNavigationStyle() {
			StyleCombination result = new StyleCombination();

			result = ClassicStyleSheet.W100;

			return (result);
		}

		internal StyleCombination RightNavigationButtonStyle() {
			StyleCombination result = new StyleCombination();

			result = new Style() {
				BorderColor = Color.FromArgb(0xE6, 0xE6, 0xE6),
				RightBorder = new Length(1, LengthUnit.Pixels),
			};
			return (result);
		}
	}
}
