namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130604110200)]
	public class InsertCrmVisitReportIntoCrmContact : Migration
	{
		public override void Up()
		{
			var contactIdIsGuid = (int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Contact' AND COLUMN_NAME = 'ContactId' and DATA_TYPE = 'uniqueidentifier'") == 1;
			if (!Database.ColumnExists("[CRM].[Contact]", "OldVisitReportId"))
			{
				Database.AddColumn("[CRM].[Contact]", "OldVisitReportId", DbType.Int32, ColumnProperty.Null);
			}

			var query = @"
			INSERT INTO [CRM].[Contact] (
				[ParentKey]
				,[Name]
				,[ContactType]
				,[ResponsibleUser]
				,[IsActive]
				,[CreateDate]
				,[ModifyDate]
				,[CreateUser]
				,[ModifyUser]
				,[Visibility]
				,[OldVisitReportId]) ";
			if (contactIdIsGuid)
			{
				query += @"
				SELECT C.[ContactId]
					,[CompanyName]
					,'VisitReport'
					,VR.[ResponsibleUser]
					,1
					,VR.[CreateDate]
					,VR.[ModifyDate]
					,VR.[CreateUser]
					,VR.[ModifyUser]
					,2
					,VisitReportId
				FROM [CRM].[OLD_VisitReport] VR
				JOIN [CRM].[Contact] C ON VR.CompanyKey = C.ContactIdOld AND C.ContactType = 'Company'";
			}
			else
			{
				query += @"
				SELECT [CompanyKey]
					,[CompanyName]
					,'VisitReport'
					,[ResponsibleUser]
					,1
					,[CreateDate]
					,[ModifyDate]
					,[CreateUser]
					,[ModifyUser]
					,2
					,VisitReportId
				FROM [CRM].[OLD_VisitReport]";
			}

			Database.ExecuteNonQuery(query);
		}
		public override void Down()
		{
		}
	}
}
