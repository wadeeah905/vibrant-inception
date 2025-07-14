namespace Crm.Service.Model.Notes
{
	using Crm.Library.Globalization.Extensions;
	using Crm.Model.Notes;

	public class ServiceCaseCreatedNote : Note
	{
		public override string DisplayText
		{
			get { return ResourceManager.Instance.GetTranslation("ServiceCaseCreated", searchStrategy: Search.OnlyPlugin); }
		}
		public override string ImageTextKey
		{
			get { return "New"; }
		}
		public override string PermanentLabelResourceKey
		{
			get { return "ServiceCaseCreatedBy"; }
		}

		// Constructor
		public ServiceCaseCreatedNote()
		{
			Plugin = "Crm.Service";
		}
	}
}