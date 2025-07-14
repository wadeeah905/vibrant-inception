namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170517090500)]
	public class AddGetVisitFrequencyValuePerYearFunction : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				CREATE FUNCTION dbo.GetVisitFrequencyValuePerYear(@LookupKey NVARCHAR(20), @VisitFrequency INT)
				RETURNS INT
				AS 
				BEGIN
					RETURN (
						SELECT @VisitFrequency * tu.TimeUnitsPerYear AS VisitFrequencyValuePerYear
						FROM LU.TimeUnit tu
						WHERE tu.Value = @LookupKey
						AND tu.Language = 'de'
					)
				END
			");
		}
	}
}