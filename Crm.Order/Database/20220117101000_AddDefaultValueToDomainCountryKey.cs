namespace Crm.Order.Database
{
    using Crm.Library.Data.MigratorDotNet.Framework;

    [Migration(20220117101000)]
	public class AddDefaultValueToDomainCountryKey : Migration
	{
		public override void Up()
		{
			var sql = "ALTER TABLE [dbo].[Domain] ADD DEFAULT '100' FOR DefaultCountryKey";
			Database.ExecuteNonQuery(sql);
		}
	}
}
