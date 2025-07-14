namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20180523140000)]
	public class RemoveVisitableAddressView : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				IF EXISTS (SELECT * FROM sys.objects WHERE [type] = 'V' AND [schema_id] = SCHEMA_ID('dbo') AND [name] = 'VisitableAddress')
				BEGIN
					DROP VIEW [dbo].[VisitableAddress]
				END");
		}
	}
}