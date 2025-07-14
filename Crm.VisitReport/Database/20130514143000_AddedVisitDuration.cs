namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130514143000)]
  public class AddedVisitDuration : Migration
  {
    public override void Up()
    {
      if (!Database.ColumnExists("CRM.Visit", "VisitDuration"))
      {
        Database.ExecuteNonQuery("ALTER TABLE CRM.Visit ADD VisitDuration TIME(0) NULL");
      }
    }
    public override void Down()
    {
    }
  }
}