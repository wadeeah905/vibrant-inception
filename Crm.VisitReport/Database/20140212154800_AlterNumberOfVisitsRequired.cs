namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140212154800)]
	public class AlterNumberOfVisitsRequired : Migration
	{
		public override void Up()
		{
			if (Database.ColumnExists("[CRM].[Company]", "NumberOfVisitsRequired"))
			{
				Database.ChangeColumn("[CRM].[Company]", new Column("NumberOfVisitsRequired", DbType.Int32, ColumnProperty.Null));
			}
		}

		public override void Down()
		{
		}
	}
}