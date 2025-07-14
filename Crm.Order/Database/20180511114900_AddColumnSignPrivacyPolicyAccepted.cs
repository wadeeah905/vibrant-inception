namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20180511114900)]
	public class AddColumnSignPrivacyPolicyAccepted : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("SignPrivacyPolicyAccepted", DbType.Boolean, ColumnProperty.NotNull, 0));
		}
	}
}