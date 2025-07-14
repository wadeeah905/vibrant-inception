namespace Crm.Order.Database
{
    using Crm.Library.Data.MigratorDotNet.Framework;
    using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;
    using System.Data;

    [Migration(20211019142000)]
    public class AddColumnValidToToCrmOrder : Migration
    {
        public override void Up()
        {
            Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("ValidTo", DbType.DateTime, ColumnProperty.Null));

        }
    }
}
