namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20241004080000)]
	public class AddDisplayDescriptionToCrmArticle : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.Article", new Column("DisplayDescription", DbType.String, 150, ColumnProperty.Null));
			}
	}
}
