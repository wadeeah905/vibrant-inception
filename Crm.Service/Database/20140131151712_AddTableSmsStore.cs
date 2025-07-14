namespace Crm.Service.Database
{
	using System;
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140131151712)]
	public class AddTableSmsStore : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[SMS].[Store]"))
			{
				Database.AddTable("[SMS].[Store]",
					new Column("StoreId", DbType.Int32, ColumnProperty.PrimaryKeyWithIdentity),
					new Column("StoreNo", DbType.String, 50, ColumnProperty.NotNull),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull),
					new Column("CreateUser", DbType.String, 50, ColumnProperty.NotNull),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull),
					new Column("ModifyUser", DbType.String, 50, ColumnProperty.NotNull),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true),
					new Column("TenantKey", DbType.Int32, ColumnProperty.Null));
			}
		}
		public override void Down()
		{
			throw new NotImplementedException();
		}
	}
}