using Crm.Library.Data.MigratorDotNet.Framework;

namespace Crm.Order.Database
{
    [Migration(20190426113800)]
    public class AlterOrderDateColumnToDateTime : Migration
    {
        public override void Up()
        {
            Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ALTER COLUMN [OrderDate] DateTime NOT NULL");
        }
    }
}
