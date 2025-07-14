namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20221108123000)]
	public class DropVisitCircuitAddress : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("IF EXISTS(SELECT 1 FROM sys.procedures WHERE [name] = 'VisitCircuitAddress') DROP PROCEDURE [dbo].[VisitCircuitAddress]");
		}
	}
}
