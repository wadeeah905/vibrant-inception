namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170510134600)]
	public class AddTableCrmVisitReportDynamicFormReference : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[VisitReportDynamicFormReference]"))
			{
				Database.AddTable("CRM.VisitReportDynamicFormReference",
					new Column("DynamicFormReferenceKey", DbType.Guid, ColumnProperty.PrimaryKey),
					new Column("Date", DbType.DateTime, ColumnProperty.NotNull),
					new Column("ResponsibleUser", DbType.String, 255, ColumnProperty.Null),
					new Column("VisitId", DbType.Guid, ColumnProperty.Null)
					);
				Database.AddForeignKey("FK_VisitReportDynamicFormReference_Visit", "[CRM].[VisitReportDynamicFormReference]", "VisitId", "[CRM].[Contact]", "ContactId");
			}
		}
	}
}
