namespace Crm.Service.Model.Notes
{
	using System;
	using System.Text;

	using Crm.Library.Extensions;
	using Crm.Library.Globalization.Extensions;
	using Crm.Model.Notes;
	using Crm.Service.Model.Lookup;

	public class OrderStatusChangedNote : Note
	{
		public override string DisplayText
		{
			get
			{
				{
					var serviceOrderStatus = Text != null ? LookupManager.Get<ServiceOrderStatus>(Text) : null;
					var serviceOrderStatusValue = serviceOrderStatus != null ? serviceOrderStatus.Value : Text;
					var displayText = new StringBuilder(ResourceManager.Instance.GetTranslation("ServiceOrderStatusSetTo", searchStrategy: Search.OnlyPlugin).WithArgs(serviceOrderStatusValue));
					var serviceOrderHead = Contact as ServiceOrderHead;
					if (serviceOrderHead != null && Text == "ReadyForInvoice")
					{
						if (serviceOrderHead.InvoiceReasonKey != null)
						{
							displayText.AppendLine();
							displayText.AppendFormat("{0}: {1}", ResourceManager.Instance.GetTranslation("InvoiceReason"), serviceOrderHead.InvoiceReason.Value);
							if (!String.IsNullOrWhiteSpace(serviceOrderHead.InvoiceRemark))
							{
								displayText.AppendFormat(" ({0})", serviceOrderHead.InvoiceRemark);
							}
						}
					}
					return displayText.ToString();
				}
			}
		}

		public override string ImageTextKey
		{
			get { return "Status"; }
		}

		public override string PermanentLabelResourceKey
		{
			get { return "OrderStatusSetToBy"; }
		}

		public OrderStatusChangedNote()
		{
			Plugin = "Crm.Service";
		}
	}
}