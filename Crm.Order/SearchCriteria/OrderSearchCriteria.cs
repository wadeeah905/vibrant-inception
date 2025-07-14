namespace Crm.Order.SearchCriteria
{
	using System;

	using Crm.Order.Model.Lookups;

	public class OrderSearchCriteria
	{
		public Guid? ContactId { get; set; }
		public string ResponsibleUser { get; set; }
		public OrderStatus OrderStatus { get; set; }
		public DateTime? FromDate { get; set; }
		public DateTime? ToDate { get; set; }
	}
}