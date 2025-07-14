namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170502150100)]
	public class AddEntityLookupColumnsToContactPersonRelationshipType : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[LU].[ContactPersonRelationshipType]", "CreateDate"))
			{
				Database.AddColumnWithDefaultValue("LU.ContactPersonRelationshipType", "CreateDate", "DATETIME", "GETUTCDATE()");
			}
			if (!Database.ColumnExists("[LU].[ContactPersonRelationshipType]", "ModifyDate"))
			{
				Database.AddColumnWithDefaultValue("LU.ContactPersonRelationshipType", "ModifyDate", "DATETIME", "GETUTCDATE()");
			}
			if (!Database.ColumnExists("[LU].[ContactPersonRelationshipType]", "CreateUser"))
			{
				Database.AddColumnWithDefaultValue("LU.ContactPersonRelationshipType", "CreateUser", "NVARCHAR(255)", "'Setup'");
			}
			if (!Database.ColumnExists("[LU].[ContactPersonRelationshipType]", "ModifyUser"))
			{
				Database.AddColumnWithDefaultValue("LU.ContactPersonRelationshipType", "ModifyUser", "NVARCHAR(255)", "'Setup'");
			}
			if (!Database.ColumnExists("[LU].[ContactPersonRelationshipType]", "IsActive"))
			{
				Database.AddColumnWithDefaultValue("LU.ContactPersonRelationshipType", "IsActive", "BIT", "1");
			}
		}
	}
}