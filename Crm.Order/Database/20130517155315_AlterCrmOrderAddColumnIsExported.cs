namespace Crm.Order.Database.Migrate
{
  using System.Data;

  using Crm.Library.Data.MigratorDotNet.Framework;
  using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

  [Migration(20130517155315)]
  public class AlterCrmOrderAddColumnIsExported : Migration

  {
    public override void Up()
    {
      Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("IsExported", DbType.Boolean, ColumnProperty.NotNull, false));

      Database.AddColumnIfNotExisting("[CRM].[OrderItem]", new Column("IsRemoval", DbType.Boolean, ColumnProperty.NotNull, false));

      Database.AddColumnIfNotExisting("[CRM].[OrderItem]", new Column("CustomDescription", DbType.String, 150, ColumnProperty.Null));
    }
    public override void Down()
    {
    }
  }
}