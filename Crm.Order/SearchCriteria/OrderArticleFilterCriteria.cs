namespace Crm.Order.SearchCriteria
{
	using System;

	using Crm.Order.Model.Lookups;

	public class OrderArticleFilterCriteria
	{
		public Guid? CustomerId { get; set; }
		public Guid? OrderId { get; set; }
		public OrderCategory OrderCategory { get; set; }
	}
}