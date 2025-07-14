namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20230428150300)]
	public class AddLineNoToCrmNote : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.Note", new Column("iNoteLineNo",DbType.Int32, ColumnProperty.Null));
		}
	}
}
