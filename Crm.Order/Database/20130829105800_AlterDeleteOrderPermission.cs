namespace Crm.Order.Database
{
	using System.Text;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130829105800)]
	public class AlterDeleteOrderPermission : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("IF EXISTS (SELECT * FROM [Crm].[Permission] WHERE Name = 'DeletetOrder') BEGIN UPDATE [Crm].[Permission] Set Name = 'DeleteOrder' WHERE Name='DeletetOrder' END");

			Database.ExecuteNonQuery(sb.ToString());
		}

		public override void Down()
		{
			
		}
	}
}