namespace Crm.Order.Model.Notes
{
	using System;

	using Crm.Library.Extensions;
	using Crm.Model.Notes;
	using Crm.Order.Model.Lookups;

	public class BaseOrderStatusChangedNote : Note
	{
		public virtual BaseOrder BaseOrder { get; set; }
		public override string DisplayText
		{
			get
			{
				var orderStatusKey = Text;
				if (String.IsNullOrWhiteSpace(orderStatusKey))
				{
					return ResourceManager.Instance.GetTranslation(Meta + "StatusSet").WithArgs("");
				}
				var orderStatus = LookupManager.Get<OrderStatus>(orderStatusKey);
				var orderStatusValue = orderStatus != null ? orderStatus.Value : orderStatusKey; // Gets the value for the CurrentUICulture
				return orderStatus?.Key == OrderStatus.ClosedKey ?
					ResourceManager.Instance.GetTranslation(Meta + "Closed") :
					ResourceManager.Instance.GetTranslation(Meta + "StatusSetTo")
						.WithArgs(ResourceManager.Instance.GetTranslation(orderStatusValue));
			}
		}
		public override string ImageTextKey
		{
			get { return "Status"; }
		}
		public override string PermanentLabelResourceKey
		{
			get { return Meta + "StatusSetBy"; }
		}
		public override string Plugin
		{
			get { return OrderPlugin.Name; }
		}
	}
}