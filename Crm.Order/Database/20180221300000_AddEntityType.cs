namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;
	using Crm.Order.Model;
	using Crm.Order.Model.Notes;

	[Migration(20180221300000)]
	public class AddEntityType : Migration
	{
		public override void Up()
		{
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<BaseOrderCreatedNote>("CRM", "Note");
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<BaseOrderStatusChangedNote>("CRM", "Note");
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<Offer>("CRM", "Order");
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<Order>("CRM", "Order");
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<OrderItem>("CRM", "OrderItem");
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<CalculationPosition>("CRM", "CalculationPosition");
		}
	}
}