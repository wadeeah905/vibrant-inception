namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	using ForeignKeyConstraint = Crm.Library.Data.MigratorDotNet.Framework.ForeignKeyConstraint;

	[Migration(20141119131702)]
	public class AddTableCrmOrderUserGroup : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[OrderUsergroup]"))
			{
				var usergroupIdIsGuid = (int)Database.ExecuteScalar(@"SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Usergroup' AND COLUMN_NAME='UsergroupId' AND DATA_TYPE = 'uniqueidentifier'") == 1;
				Database.AddTable("[CRM].[OrderUsergroup]",
					new Column("OrderKey", DbType.Int64, ColumnProperty.NotNull),
					new Column("UsergroupKey", usergroupIdIsGuid ? DbType.Guid : DbType.Int32, ColumnProperty.NotNull),
					new Column("TenantKey", DbType.Int32, ColumnProperty.Null));
				Database.AddPrimaryKey("PK_OrderUsergroup", "[CRM].[OrderUsergroup]", "OrderKey", "UsergroupKey");
				Database.AddForeignKey("FK_OrderUsergroup_Order", "[CRM].[OrderUsergroup]", "OrderKey", "[CRM].[Order]", "OrderId", ForeignKeyConstraint.Cascade);
				Database.AddForeignKey("FK_OrderUserGroup_Usergroup", "[CRM].[OrderUsergroup]", "UsergroupKey", "[CRM].[Usergroup]", "UserGroupId", ForeignKeyConstraint.Cascade);
			}
		}
	}
}