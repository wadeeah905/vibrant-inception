namespace Crm.Project.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20211123103800)]
	public class InsertValuesToVisitStatus : Migration
	{
		public override void Up()
		{
			InsertLookupValue("Created", "Erstellt", "de", "InProgress,Completed", "0", "0");
			InsertLookupValue("Created", "Created", "en", "InProgress,Completed", "0", "0");
			InsertLookupValue("Created", "Létrehozva", "hu", "InProgress,Completed", "0", "0");
			InsertLookupValue("Created", "Créé", "fr", "InProgress,Completed", "0", "0");
			InsertLookupValue("Created", "Creado", "es", "InProgress,Completed", "0", "0");

			InsertLookupValue("Scheduled", "Eingeplant", "de", "InProgress,Completed", "0", "1");
			InsertLookupValue("Scheduled", "Scheduled", "en", "InProgress,Completed", "0", "1");
			InsertLookupValue("Scheduled", "Tervezve", "hu", "InProgress,Completed", "0", "1");
			InsertLookupValue("Scheduled", "Planifié", "fr", "InProgress,Completed", "0", "1");
			InsertLookupValue("Scheduled", "Programado", "es", "InProgress,Completed", "0", "1");

			InsertLookupValue("InProgress", "In Bearbeitung", "de", "Completed", "0", "2");
			InsertLookupValue("InProgress", "In Progress", "en", "Completed", "0", "2");
			InsertLookupValue("InProgress", "Folyamatban", "hu", "Completed", "0", "2");
			InsertLookupValue("InProgress", "In En cours", "fr", "Completed", "0", "2");
			InsertLookupValue("InProgress", "En curso", "es", "Completed", "0", "2");

			InsertLookupValue("Completed", "Abgeschlossen", "de", null, "0", "3");
			InsertLookupValue("Completed", "Completed", "en", null, "0", "3");
			InsertLookupValue("Completed", "Befejezve", "hu", null, "0", "3");
			InsertLookupValue("Completed", "Fermé", "fr", null, "0", "3");
			InsertLookupValue("Completed", "Completado", "es", null, "0", "3");
		}
		private void InsertLookupValue(string value, string name, string language, string settableStatuses, string favorite, string sortOrder)
		{
			Database.Insert("[LU].[VisitStatus]",
				new[] { "Value", "Name", "Language", "SettableStatuses", "Favorite", "SortOrder", "CreateUser", "ModifyUser"},
				new[] { value, name, language, settableStatuses, favorite, sortOrder, "Setup", "Setup" });
		}
	}
}