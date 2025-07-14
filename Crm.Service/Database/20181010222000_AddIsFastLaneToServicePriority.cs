namespace Crm.Service.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(201810102220000)]
	public class AddIsFastLaneToServicePriority : Migration
	{
		public override void Up()
		{
			Database.AddColumn("SMS.ServicePriority", new Column("IsFastLane", DbType.Boolean, ColumnProperty.NotNull, false));
		}
	}
}
