namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130626145400)]
	public class InsertOldCrmVisitIntoCrmVisit : Migration
	{
		public override void Up()
		{
			var contactIdIsGuid = (int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Contact' AND COLUMN_NAME = 'ContactId' and DATA_TYPE = 'uniqueidentifier'") == 1;
			var query = @"
				INSERT INTO [CRM].[Visit] (
					[ContactKey]
					,[AddressKey]
					,[Street]
					,[ZipCode]
					,[City]
					,[CountryKey]
					,[VisitReportKey]
					,[VisitReportStatus]
					,[ContactPerson]
					,[Date]
					,[Time]
					,[Aim]
					,[VisitDuration]
					,[TenantKey]
					)";
			if (contactIdIsGuid)
			{
				query += @"
				SELECT c.[ContactId]
					,a.[AddressId]
					,v.[Street]
					,v.[ZipCode]
					,v.[City]
					,v.[CountryKey]
					,v.[VisitReportKey]
					,v.[VisitReportStatus]
					,v.[ContactPerson]
					,v.[Date]
					,v.[Time]
					,v.[Aim]
					,v.[VisitDuration]
					,c.[TenantKey]
				FROM [CRM].[OLD_Visit] v
				JOIN [CRM].[Contact] c ON c.[OldVisitId] = v.[VisitId] AND c.[ContactType] = 'Visit'
				JOIN [CRM].[Address] a ON a.AddressIdOld = v.AddressKey";
			}
			else
			{
				query += @"
				SELECT c.[ContactId]
					,v.[AddressKey]
					,v.[Street]
					,v.[ZipCode]
					,v.[City]
					,v.[CountryKey]
					,v.[VisitReportKey]
					,v.[VisitReportStatus]
					,v.[ContactPerson]
					,v.[Date]
					,v.[Time]
					,v.[Aim]
					,v.[VisitDuration]
					,c.[TenantKey]
				FROM [CRM].[OLD_Visit] v
				JOIN [CRM].[Contact] c ON c.[OldVisitId] = v.[VisitId]
				WHERE c.[ContactType] = 'Visit'";
			}
			Database.ExecuteNonQuery(query);
		}
		public override void Down()
		{
		}
	}
}
