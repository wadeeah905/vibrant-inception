namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130529130600)]
  public class SetVisitDurationNullToValueInCrmVisit : Migration
  {
    public override void Up()
    {
      if (Database.ColumnExists("CRM.Visit", "VisitDuration"))
      {
        Database.ExecuteNonQuery("UPDATE [CRM].[Visit] SET VisitDuration = '00:00:00' WHERE VisitDuration IS NULL");
      }
    }
    public override void Down()
    {
    }
  }
}