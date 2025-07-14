namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120419122124)]
	public class AddColumnAddressKeyToTableCrmVisitReport : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[Crm].[VisitReport]", "AddressKey"))
			{
				var addressDataType = (string)Database.ExecuteScalar("SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Address' AND COLUMN_NAME = 'AddressId'");
				StringBuilder sb = new StringBuilder();

				Database.ExecuteNonQuery(@"
				IF EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='VisitReport' AND COLUMN_NAME='CompanyKey' AND DATA_TYPE = 'int') AND EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='Contact' AND COLUMN_NAME='ContactId' AND DATA_TYPE = 'uniqueidentifier')
				BEGIN
					EXEC sp_rename '[CRM].[VisitReport].[CompanyKey]', 'CompanyKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[VisitReport] ADD [CompanyKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[CompanyKey] = b.[ContactId] FROM [CRM].[VisitReport] a JOIN [CRM].[Contact] b ON a.[CompanyKeyOld] = b.[ContactIdOld]')
					EXEC('DELETE FROM [CRM].[VisitReport] WHERE [CompanyKey] IS NULL')
					ALTER TABLE [CRM].[VisitReport] ALTER COLUMN [CompanyKey] uniqueidentifier NOT NULL
					ALTER TABLE [CRM].[VisitReport] ALTER COLUMN [CompanyKeyOld] int NULL
				END
				");

				sb.AppendLine($"ALTER TABLE Crm.VisitReport ADD AddressKey {addressDataType} null");

				Database.ExecuteNonQuery(sb.ToString());

				sb.Clear();

				sb.AppendLine("UPDATE vr");
				sb.AppendLine("SET vr.AddressKey = ");
				sb.AppendLine("(");
				sb.AppendLine(" SELECT TOP 1 a.AddressId");
				sb.AppendLine(" FROM Crm.Address a");
				sb.AppendLine(" WHERE a.CompanyKey = vr.CompanyKey AND a.IsActive = 1 AND a.IsCompanyStandardAddress = 1");
				sb.AppendLine(")");
				sb.AppendLine("FROM Crm.VisitReport vr");

				Database.ExecuteNonQuery(sb.ToString());

				sb.Clear();

				sb.AppendLine($"ALTER TABLE Crm.VisitReport ALTER COLUMN AddressKey {addressDataType} not null");

				Database.ExecuteNonQuery(sb.ToString());
			}
		}

		public override void Down()
		{
		}
	}
}
