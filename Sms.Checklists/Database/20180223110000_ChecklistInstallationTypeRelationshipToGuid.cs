namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20180223110000)]
	public class ChecklistInstallationTypeRelationshipToGuid : Migration
	{
		public override void Up()
		{
			if (Database.GetColumnDataType("SMS", "ChecklistInstallationTypeRelationship", "ChecklistInstallationTypeRelationshipId") == "int")
			{
				Database.ExecuteNonQuery(@"
					DECLARE @key NVARCHAR(MAX) = (
						SELECT [name] FROM sys.key_constraints
						WHERE parent_object_id = object_id('SMS.ChecklistInstallationTypeRelationship')
							AND [type] = 'PK')
					DECLARE @sql NVARCHAR(MAX) = 'ALTER TABLE SMS.ChecklistInstallationTypeRelationship DROP CONSTRAINT ' + @key
					EXEC sp_executesql @sql");
				Database.ExecuteNonQuery("ALTER TABLE SMS.ChecklistInstallationTypeRelationship ADD ChecklistInstallationTypeRelationshipIdOld INT NULL");
				Database.ExecuteNonQuery(@"
					UPDATE SMS.ChecklistInstallationTypeRelationship
					SET ChecklistInstallationTypeRelationshipIdOld = ChecklistInstallationTypeRelationshipId
						,ModifyDate = GETUTCDATE()
						,ModifyUser = 'Migration_20180223110000'");
				Database.ExecuteNonQuery("ALTER TABLE SMS.ChecklistInstallationTypeRelationship DROP COLUMN ChecklistInstallationTypeRelationshipId");
				Database.ExecuteNonQuery(@"
					ALTER TABLE SMS.ChecklistInstallationTypeRelationship
					ADD ChecklistInstallationTypeRelationshipId UNIQUEIDENTIFIER
					CONSTRAINT DF_ChecklistInstallationTypeRelationship_ChecklistInstallationTypeRelationshipId DEFAULT(NEWSEQUENTIALID())
					CONSTRAINT PK_ChecklistInstallationTypeRelationship PRIMARY KEY");
			}
			Database.AddEntityBaseDefaultContraints("SMS", "ChecklistInstallationTypeRelationship");
		}
	}
}