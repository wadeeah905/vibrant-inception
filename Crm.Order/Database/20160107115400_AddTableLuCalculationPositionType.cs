namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160107115400)]
	public class AddTableLuCalculationPositionType : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("LU.CalculationPositionType"))
			{
				Database.AddTable("LU.CalculationPositionType",
					new Column("CalculationPositionTypeId", DbType.Int32, ColumnProperty.PrimaryKeyWithIdentity),
					new Column("Value", DbType.String, 20, ColumnProperty.NotNull),
					new Column("Name", DbType.String, ColumnProperty.NotNull),
					new Column("Language", DbType.String, 2, ColumnProperty.NotNull),
					new Column("Favorite", DbType.Boolean, ColumnProperty.NotNull, false),
					new Column("SortOrder", DbType.Int32, ColumnProperty.NotNull, 0),
					new Column("HasPurchasePrice", DbType.Boolean, ColumnProperty.NotNull, false),
					new Column("IsAbsolute", DbType.Boolean, ColumnProperty.NotNull, true),
					new Column("IsDefault", DbType.Boolean, ColumnProperty.NotNull, false),
					new Column("IsDiscount", DbType.Boolean, ColumnProperty.NotNull, false),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("CreateUser", DbType.String, 256, ColumnProperty.NotNull),
					new Column("ModifyUser", DbType.String, 256, ColumnProperty.NotNull),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true),
					new Column("TenantKey", DbType.Int32, ColumnProperty.Null));
			}
		}
	}
}