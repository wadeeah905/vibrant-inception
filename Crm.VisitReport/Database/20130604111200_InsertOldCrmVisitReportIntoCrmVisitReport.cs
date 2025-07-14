namespace Crm.VisitReport.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130604111200)]
	public class InsertOldCrmVisitReportIntoCrmVisitReport : Migration
	{
		public override void Up()
		{
			var sb = new StringBuilder();

			sb.AppendLine("INSERT INTO [CRM].[VisitReport]");
			sb.AppendLine("([ContactKey],");
			sb.AppendLine("[Street],");
			sb.AppendLine("[ZipCode],");
			sb.AppendLine("[City],");
			sb.AppendLine("[ContactPerson],");
			sb.AppendLine("[VisitDate],");
			sb.AppendLine("[VisitAim],");
			sb.AppendLine("[Status],");
			sb.AppendLine("[Version],");
			sb.AppendLine("[AddressKey])");
			sb.AppendLine("SELECT");
			sb.AppendLine("c.[ContactId],");
			sb.AppendLine("v.[Street],");
			sb.AppendLine("v.[ZipCode],");
			sb.AppendLine("v.[City],");
			sb.AppendLine("v.[ContactPerson],");
			sb.AppendLine("v.[VisitDate],");
			sb.AppendLine("v.[VisitAim],");
			sb.AppendLine("v.[Status],");
			sb.AppendLine("v.[Version],");
			sb.AppendLine("v.[AddressKey]");
			sb.AppendLine("FROM [CRM].[OLD_VisitReport] v");
			sb.AppendLine("JOIN [CRM].[Contact] c");
			sb.AppendLine("ON c.[OldVisitReportId] = v.[VisitReportId]");
			sb.AppendLine("WHERE c.[ContactType] = 'VisitReport'");

			Database.ExecuteNonQuery(sb.ToString());
		}
		public override void Down()
		{
		}
	}
}