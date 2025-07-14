namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20121023113831)]
	public class AddedEntityColumnsToCrmVisit : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.Visit", new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true));
		}
		public override void Down()
		{
			Database.RemoveColumnIfExisting("CRM.Visit", "IsActive");
		}
	}
}