namespace Crm.Service.Model.Lookup
{
	using System.Globalization;

	using Crm.Library.Globalization.Lookup;

	[Lookup("[SMS].[NotificationStandardAction]")]
	public class NotificationStandardAction : EntityLookup<string>
	{
		public static readonly NotificationStandardAction Created = new NotificationStandardAction { Key = "created", Value = "created", Language = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName };
		public static readonly NotificationStandardAction Save = new NotificationStandardAction { Key = "save", Value = "save", Language = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName };
		public static readonly NotificationStandardAction Dismiss = new NotificationStandardAction { Key = "dismiss", Value = "dismiss", Language = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName };
		public static readonly NotificationStandardAction Resolved = new NotificationStandardAction { Key = "resolved", Value = "resolved", Language = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName };
		public static readonly NotificationStandardAction Convert = new NotificationStandardAction { Key = "convert", Value = "convert", Language = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName };
		public static readonly NotificationStandardAction Info = new NotificationStandardAction { Key = "info", Value = "info", Language = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName };
		public static readonly NotificationStandardAction Progress = new NotificationStandardAction { Key = "progress", Value = "progress", Language = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName };

		[LookupProperty(Shared = true)]
		public virtual string TemplateOrderNo { get; set; }
		[LookupProperty(Shared = true)]
		public virtual int? TargetStatus { get; set; }
		[LookupProperty(Shared = true)]
		public virtual string WorkflowTarget { get; set; }
	}
}
