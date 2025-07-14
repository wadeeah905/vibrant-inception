using Crm.Library.Data.MigratorDotNet.Framework;

namespace Crm.Service.Database
{
	[Migration(20170208181000)]
	public class AlterNameColumnInLookups : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("ALTER TABLE [LU].[OrderCategory] ALTER COLUMN [Name] NVARCHAR(50) NOT NULL");
		}
	}
}