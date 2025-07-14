namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130903257599)]
	public class AddNumberOfVisitsRequired : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[CRM].[Company]", new Column("NumberOfVisitsRequired", DbType.Double, ColumnProperty.Null));
		}

		public override void Down()
		{
		}
	}
}