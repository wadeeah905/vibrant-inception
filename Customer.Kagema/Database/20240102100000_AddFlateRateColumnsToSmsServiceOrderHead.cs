namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240102100000)]
	public class AddFlateRateColumnsToSmsServiceOrderHead : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.ServiceOrderHead", new Column("TravelFlateRate", DbType.Boolean, ColumnProperty.Null,false));
			Database.AddColumnIfNotExisting("SMS.ServiceOrderHead", new Column("OfferFlateRate", DbType.Boolean, ColumnProperty.Null, false));
		}
	}
}
