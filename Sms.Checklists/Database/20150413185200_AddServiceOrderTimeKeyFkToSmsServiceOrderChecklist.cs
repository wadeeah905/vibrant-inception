namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150413185200)]
	public class AddServiceOrderTimeKeyFkToSmsServiceOrderChecklist : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM sys.foreign_keys WHERE name = 'FK_ServiceOrderChecklist_ServiceOrderTime'") == 0)
			{
				Database.ExecuteNonQuery("UPDATE soc SET soc.[ServiceOrderTimeKey] = NULL FROM [SMS].[ServiceOrderChecklist] soc LEFT OUTER JOIN [SMS].[ServiceOrderTimes] sot ON soc.[ServiceOrderTimeKey] = sot.[Id] WHERE sot.[Id] IS NULL");
				Database.AddForeignKey("FK_ServiceOrderChecklist_ServiceOrderTime", "[SMS].[ServiceOrderChecklist]", "ServiceOrderTimeKey", "[SMS].[ServiceOrderTimes]", "Id", ForeignKeyConstraint.NoAction);
			}
		}
	}
}