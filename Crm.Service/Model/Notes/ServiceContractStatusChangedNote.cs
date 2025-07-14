namespace Crm.Service.Model.Notes
{
	using Crm.Library.Extensions;
	using Crm.Library.Globalization.Extensions;
	using Crm.Model.Notes;

	public class ServiceContractStatusChangedNote : Note
	{
		public override string DisplayText
		{
			get
			{
				var serviceContractStatusValue = Text;
				return ResourceManager.Instance.GetTranslation("ServiceContractStatusSet", searchStrategy: Search.OnlyPlugin).WithArgs(serviceContractStatusValue);
			}
		}
		public override string ImageTextKey
		{
			get { return "Status"; }
		}
		public override string PermanentLabelResourceKey
		{
			get { return "NotificationStatusSetToBy"; }
		}
	}
}