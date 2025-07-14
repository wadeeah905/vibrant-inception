namespace Crm.Order.Model
{
	using System;

	using Crm.Model;

	public class Order : BaseOrder
	{
		public virtual Guid? OfferId { get; set; }

		public Order()
		{
		}
		public Order(Company company, string responsibleUser)
			: base(company, responsibleUser)
		{
		}
	}
}