namespace Crm.Service.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20180222101500)]
	public class StoreToGuid : Migration
	{
		public override void Up()
		{
			if (Database.GetColumnDataType("SMS", "Store", "StoreId") == "int")
			{
				Database.ExecuteNonQuery(@"
					DECLARE @key NVARCHAR(MAX) = (
						SELECT [name] FROM sys.key_constraints
						WHERE parent_object_id = object_id('SMS.Store')
							AND [type] = 'PK')
					DECLARE @sql NVARCHAR(MAX) = 'ALTER TABLE SMS.Store DROP CONSTRAINT ' + @key
					EXEC sp_executesql @sql");
				Database.ExecuteNonQuery("ALTER TABLE SMS.Store ADD StoreIdOld INT NULL");
				Database.ExecuteNonQuery(@"
					UPDATE SMS.Store
					SET StoreIdOld = StoreId
						,ModifyDate = GETUTCDATE()
						,ModifyUser = 'Migration_20180222101500'");
				Database.ExecuteNonQuery("ALTER TABLE SMS.Store DROP COLUMN StoreId");
				Database.ExecuteNonQuery(@"
					ALTER TABLE SMS.Store
					ADD StoreId UNIQUEIDENTIFIER
					CONSTRAINT DF_Store_StoreId DEFAULT(NEWSEQUENTIALID())
					CONSTRAINT PK_Store PRIMARY KEY");
			}
			Database.AddEntityBaseDefaultContraints("SMS", "Store");
		}
	}
}