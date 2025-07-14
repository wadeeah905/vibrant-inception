namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150409134200)]
	public class AddVisitIdToVisitReport : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[Crm].[VisitReport]", "VisitId"))
			{
				var hasVisitIdChangedToGuid = (int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Visit' AND COLUMN_NAME = 'ContactKey' and DATA_TYPE = 'uniqueidentifier'") == 1;
				Database.AddColumn("[Crm].[VisitReport]", new Column("VisitId", hasVisitIdChangedToGuid ? DbType.Guid : DbType.Int32, ColumnProperty.Null));
			}
		}

		public override void Down()
		{
		}
	}
}