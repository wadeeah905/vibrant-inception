namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170504151500)]
	public class AddDescriptionColumnToCrmVisitTopic : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[Crm].[VisitTopic]", new Column("Description", DbType.String, 4000, ColumnProperty.Null));
		}
	}
}