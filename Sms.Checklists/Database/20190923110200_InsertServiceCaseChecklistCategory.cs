namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20190923110200)]
	public class InsertServiceCaseChecklistCategory : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("INSERT INTO LU.DynamicFormCategory (Name, Language, Value) VALUES ('Servicefallcheckliste', 'de', 'ServiceCaseChecklist')");
			Database.ExecuteNonQuery("INSERT INTO LU.DynamicFormCategory (Name, Language, Value) VALUES ('Service case checklist', 'en', 'ServiceCaseChecklist')");
			Database.ExecuteNonQuery("INSERT INTO LU.DynamicFormCategory (Name, Language, Value) VALUES ('Listes de contrôle des demandes de service', 'fr', 'ServiceCaseChecklist')");
			Database.ExecuteNonQuery("INSERT INTO LU.DynamicFormCategory (Name, Language, Value) VALUES ('Szervizeset csekklista', 'hu', 'ServiceCaseChecklist')");
		}
	}
}
