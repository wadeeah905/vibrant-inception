namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120416000905)]
	public class CrmVisitReportAddColumnsForVisitFrequencyToCrmContact : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("Crm.Contact", "CompanyVisitFrequencyValue"))
				Database.ExecuteNonQuery("ALTER TABLE Crm.Contact ADD CompanyVisitFrequencyValue int null");

			if (!Database.ColumnExists("Crm.Contact", "CompanyVisitFrequencyTimeUnitKey"))
				Database.ExecuteNonQuery("ALTER TABLE Crm.Contact ADD CompanyVisitFrequencyTimeUnitKey nvarchar(20) null");
		}

		public override void Down()
		{
		}
	}
}
