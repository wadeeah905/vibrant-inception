namespace Crm.Order.Model.Notes
{
	using Crm.Model.Notes;

	public class BaseOrderCreatedNote : Note
	{
		public override string ImageTextKey
		{
			get { return "New"; }
		}
		public override string DisplayText
		{
			get { return ResourceManager.Instance.GetTranslation(Text); }
		}
		public override string PermanentLabelResourceKey
		{
			get { return Meta == "Order" ? "OrderCreatedBy" : "OfferCreatedBy"; }
		}
		public virtual BaseOrder BaseOrder { get; set; }
		public override string Plugin
		{
			get { return OrderPlugin.Name; }
		}
	}
}