namespace Crm.Service.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20180222100000)]
	public class LocationToGuid : Migration
	{
		public override void Up()
		{
			if (Database.GetColumnDataType("SMS", "Location", "LocationId") == "int")
			{
				Database.ExecuteNonQuery(@"
					DECLARE @key NVARCHAR(MAX) = (
						SELECT [name] FROM sys.key_constraints
						WHERE parent_object_id = object_id('SMS.Location')
							AND [type] = 'PK')
					DECLARE @sql NVARCHAR(MAX) = 'ALTER TABLE SMS.Location DROP CONSTRAINT ' + @key
					EXEC sp_executesql @sql");
				Database.ExecuteNonQuery("ALTER TABLE SMS.Location ADD LocationIdOld INT NULL");
				Database.ExecuteNonQuery(@"
					UPDATE SMS.Location
					SET LocationIdOld = LocationId
						,ModifyDate = GETUTCDATE()
						,ModifyUser = 'Migration_20180222100000'");
				Database.ExecuteNonQuery("ALTER TABLE SMS.Location DROP COLUMN LocationId");
				Database.ExecuteNonQuery(@"
					ALTER TABLE SMS.Location
					ADD LocationId UNIQUEIDENTIFIER
					CONSTRAINT DF_Location_LocationId DEFAULT(NEWSEQUENTIALID())
					CONSTRAINT PK_Location PRIMARY KEY");
			}
			Database.AddEntityBaseDefaultContraints("SMS", "Location");
		}
	}
}