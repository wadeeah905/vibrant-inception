namespace Crm.Order.Database.Migrate
{
  using System.Data;

  using Crm.Library.Data.MigratorDotNet.Framework;
  using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

  [Migration(20130517174545)]
  public class AlterCrmOrderAddColumnOrderType : Migration

  {
    public override void Up()
    {
      Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("OrderType", DbType.String, 20, ColumnProperty.NotNull, "'Order'"));
    }
    public override void Down()
    {
    }
  }
}