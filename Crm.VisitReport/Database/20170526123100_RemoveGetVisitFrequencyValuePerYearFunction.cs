namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170526123100)]
	public class RemoveGetVisitFrequencyValuePerYearFunction : Migration
	{
		public override void Up()
		{
			
			Database.ExecuteNonQuery(@"IF EXISTS (SELECT *
				FROM  sys.objects
				WHERE object_id = OBJECT_ID(N'[dbo].[GetVisitFrequencyValuePerYear]'))
			DROP FUNCTION [dbo].[GetVisitFrequencyValuePerYear]");
		}
	}
}