namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140205164899)]
	public class AddCommunicationType : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[CRM].[Order]", new Column("CommunicationType", DbType.String));
		}
		public override void Down()
		{
		}
	}
}