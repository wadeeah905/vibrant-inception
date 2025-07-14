namespace Crm.Order.Model.Extensions
{
	using System;

	using Crm.Library.Extensions;

	public static class BaseOrderExtensions
	{
		public static string PublicDescriptionPreview(this BaseOrder order)
		{
			return order.PublicDescription.LimitWithElipses(20);
		}
		public static string PublicDescriptionLongPreview(this BaseOrder order)
		{
			return order.PublicDescription.LimitWithElipses(210);
		}

		public static decimal PriceAfterDiscount(this OrderItem orderItem)
		{
			return (1 - orderItem.Discount) * orderItem.Price;
		}

		public static string Preview(this BaseOrder order)
		{
			return order.Company.IsNotNull() ? String.Format("{0} {1}", order.OrderNo, order.Company.Name) : order.OrderNo;
		}
	}
}