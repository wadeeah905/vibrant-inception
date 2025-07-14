namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	using ForeignKeyConstraint = Crm.Library.Data.MigratorDotNet.Framework.ForeignKeyConstraint;

	[Migration(20160624120000)]
	public class AddTableCrmCalculationPosition : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("CRM.CalculationPosition"))
			{
				Database.AddTable("CRM.CalculationPosition",
					new Column("CalculationPositionId", DbType.Guid, ColumnProperty.PrimaryKey, "NEWSEQUENTIALID()"),
					new Column("OrderKey", DbType.Guid, ColumnProperty.NotNull),
					new Column("CalculationPositionTypeKey", DbType.String, 20, ColumnProperty.NotNull),
					new Column("PurchasePrice", DbType.Decimal, ColumnProperty.NotNull, 0),
					new Column("Remark", DbType.String, 4000, ColumnProperty.Null),
					new Column("SalesPrice", DbType.Decimal, ColumnProperty.NotNull, 0),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("CreateUser", DbType.String, 256, ColumnProperty.NotNull),
					new Column("ModifyUser", DbType.String, 256, ColumnProperty.NotNull),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true),
					new Column("TenantKey", DbType.Int32, ColumnProperty.Null));
				Database.AddForeignKey("FK_CalculationPosition_Order", "[CRM].[CalculationPosition]", "OrderKey", "[CRM].[Order]", "OrderId", ForeignKeyConstraint.Cascade);
			}
		}
	}
}