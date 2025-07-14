namespace Sms.Checklists.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20191021151200)]
	public class AddCanAttachServiceCasesToDynamicFormElement : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.DynamicFormElement", new Column("CanAttachServiceCases", DbType.Boolean, ColumnProperty.NotNull, false));
		}
	}
}