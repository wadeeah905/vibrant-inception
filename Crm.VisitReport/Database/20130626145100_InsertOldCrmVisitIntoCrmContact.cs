namespace Crm.VisitReport.Database
{
	using System.Data;
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130626145100)]
	public class InsertOldCrmVisitIntoCrmContact : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Contact]", "OldVisitId"))
			{
				Database.AddColumn("[CRM].[Contact]", "OldVisitId", DbType.Int32, ColumnProperty.Null);
			}

			Database.ExecuteNonQuery(@"
				IF EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='OLD_Visit' AND COLUMN_NAME='CompanyKey' AND DATA_TYPE = 'int') AND EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Contact' AND COLUMN_NAME='ContactId' AND DATA_TYPE = 'uniqueidentifier')
				BEGIN
					EXEC sp_rename '[CRM].[OLD_Visit].[CompanyKey]', 'CompanyKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[OLD_Visit] ADD [CompanyKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[CompanyKey] = b.[ContactId] FROM [CRM].[OLD_Visit] a JOIN [CRM].[Contact] b ON a.[CompanyKeyOld] = b.[ContactIdOld]')
					EXEC('DELETE FROM [CRM].[OLD_Visit] WHERE [CompanyKey] IS NULL')
					ALTER TABLE [CRM].[OLD_Visit] ALTER COLUMN [CompanyKey] uniqueidentifier NOT NULL
					ALTER TABLE [CRM].[OLD_Visit] ALTER COLUMN [CompanyKeyOld] int NULL
				END
				");
			Database.ExecuteNonQuery(@"
				IF EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='OLD_Visit' AND COLUMN_NAME='AddressKey' AND DATA_TYPE = 'int') AND EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Address' AND COLUMN_NAME='AddressId' AND DATA_TYPE = 'uniqueidentifier')
				BEGIN
					EXEC sp_rename '[CRM].[OLD_Visit].[AddressKey]', 'AddressKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[OLD_Visit] ADD [AddressKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[AddressKey] = b.[AddressId] FROM [CRM].[OLD_Visit] a JOIN [CRM].[Address] b ON a.[AddressKeyOld] = b.[AddressIdOld]')
					EXEC('DELETE FROM [CRM].[OLD_Visit] WHERE [AddressKey] IS NULL')
					ALTER TABLE [CRM].[OLD_Visit] ALTER COLUMN [AddressKey] uniqueidentifier NOT NULL
					ALTER TABLE [CRM].[OLD_Visit] ALTER COLUMN [AddressKeyOld] int NULL
				END
				");

			var sb = new StringBuilder();

			sb.AppendLine("INSERT INTO [CRM].[Contact]");
			sb.AppendLine("([ParentKey]");
			sb.AppendLine(",[Name]");
			sb.AppendLine(",[ContactType]");
			sb.AppendLine(",[ResponsibleUser]");
			sb.AppendLine(",[IsActive]");
			sb.AppendLine(",[CreateDate]");
			sb.AppendLine(",[ModifyDate]");
			sb.AppendLine(",[CreateUser]");
			sb.AppendLine(",[ModifyUser]");
			sb.AppendLine(",[Visibility]");
			sb.AppendLine(",[OldVisitId])");
			sb.AppendLine("SELECT [CompanyKey]");
			sb.AppendLine(",[CompanyName]");
			sb.AppendLine(",'Visit'");
			sb.AppendLine(",[ResponsibleUser]");
			sb.AppendLine(",1");
			sb.AppendLine(",[CreateDate]");
			sb.AppendLine(",[ModifyDate]");
			sb.AppendLine(",[CreateUser]");
			sb.AppendLine(",[ModifyUser]");
			sb.AppendLine(",2");
			sb.AppendLine(",VisitId");
			sb.AppendLine("FROM [CRM].[OLD_Visit]");

			Database.ExecuteNonQuery(sb.ToString());
		}
		public override void Down()
		{
		}
	}
}