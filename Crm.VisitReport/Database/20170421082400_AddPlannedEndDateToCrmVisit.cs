namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170421082400)]
	public class AddPlannedEndDateToCrmVisit : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[Crm].[Visit]", new Column("PlannedEndDate", DbType.DateTime, ColumnProperty.Null));
		}
	}
}