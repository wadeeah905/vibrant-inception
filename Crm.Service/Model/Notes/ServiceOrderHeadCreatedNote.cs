namespace Crm.Service.Model.Notes
{
	using Crm.Library.Globalization.Extensions;
	using Crm.Model.Notes;

	public class ServiceOrderHeadCreatedNote : Note
	{
		public override string DisplayText
		{
			get { return ResourceManager.Instance.GetTranslation("ServiceOrderHeadCreated", searchStrategy: Search.OnlyPlugin); }
		}
		public override string ImageTextKey
		{
			get { return "ServiceOrder"; }
		}
		public override string PermanentLabelResourceKey
		{
			get { return "ServiceOrderHeadCreatedBy"; }
		}

		// Constructor
		public ServiceOrderHeadCreatedNote()
		{
			Plugin = "Crm.Service";
		}
	}
}