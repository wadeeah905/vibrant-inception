namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20211123114500)]
	public class AddStatusColumnToVisitTable : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Visit]","Status"))
			{
				Database.AddColumn("[CRM].[Visit]", "Status", DbType.String, 50);
			}
		}
	}
}