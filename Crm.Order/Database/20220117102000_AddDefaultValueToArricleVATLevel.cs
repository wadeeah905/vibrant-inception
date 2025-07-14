namespace Crm.Order.Database
{
    using Crm.Library.Data.MigratorDotNet.Framework;

    [Migration(20220117102000)]
	public class AddDefaultValueToArticleVATLevel : Migration
	{
		public override void Up()
		{
			var sql = "ALTER TABLE [CRM].[Article] ADD DEFAULT 'A' FOR [VATLevelKey]";
			Database.ExecuteNonQuery(sql);
		}
	}
}
