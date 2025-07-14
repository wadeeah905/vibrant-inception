using System;
using Crm.Library.Data.MigratorDotNet.Framework;

namespace Crm.VisitReport.Database
{
	[Migration(20210422134600)]
	public class AddSpanishLookups : Migration
	{
		public override void Up()
		{
			string tableName = "[LU].[ContactPersonRelationshipType]";
			if (Database.TableExists(tableName))
			{
				string[] columns = { "Name", "Language", "Value" };
				InsertLookupValue(tableName, columns, "'Participante', 'es', '100'");
				InsertLookupValue(tableName, columns, "'Empleado propio', 'es', '101'");
			}
		}
		private void InsertLookupValue(string tableName, string[] columns, string values, bool hasIsActiveColumn = true)
		{
			int keyColumnIndex = Array.IndexOf(columns, "Value");
			string keyValue = values.Split(',')[keyColumnIndex].Trim(new char[] { ' ', '\'' });
			if ((int)Database.ExecuteScalar($"SELECT COUNT(*) FROM {tableName} WHERE {(hasIsActiveColumn ? "[IsActive]" : 1)} = 1 AND [Value] = '{keyValue}'") > 0)
			{
				Database.ExecuteNonQuery($"INSERT INTO {tableName} ({string.Join(", ", columns)}) VALUES ({values})");
			}
		}
	}
}