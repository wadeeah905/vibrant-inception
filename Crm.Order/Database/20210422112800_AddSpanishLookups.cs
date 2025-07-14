using System;
using Crm.Library.Data.MigratorDotNet.Framework;

namespace Crm.Order.Database
{
	[Migration(20210422112800)]
	public class AddSpanishLookups : Migration
	{
		public override void Up()
		{
			string tableName = "[LU].[CalculationPositionType]";
			if (Database.TableExists(tableName))
			{
				string[] columns = { "Value", "Name", "Language", "IsDiscount" };
				InsertLookupValue(tableName, columns, "'Costs', 'Costes varios', 'es', 0");
				InsertLookupValue(tableName, columns, "'Discount', 'Descuento', 'es', 1");
				InsertLookupValue(tableName, columns, "'CreditItem', 'Elemento de crédito', 'es', 1");
			}
			tableName = "[LU].[OrderCategory]";
			if (Database.TableExists(tableName))
			{
				string[] columns = { "Name", "Language", "Favorite", "SortOrder", "Value" };
				InsertLookupValue(tableName, columns, "'Estándar', 'es', 1, 0, 'Standard'");
			}
			tableName = "[LU].[OrderEntryType]";
			if (Database.TableExists(tableName))
			{
				string[] columns = { "Value", "Name", "Language", "Favorite", "SortOrder" };
				InsertLookupValue(tableName, columns, "'Configuration', 'Configuración', 'es', 0, 0");
				InsertLookupValue(tableName, columns, "'MultiDelivery', 'Múltiples entregas', 'es', 0, 0");
				InsertLookupValue(tableName, columns, "'SingleDelivery', 'Entrega única', 'es', 0, 0");
			}
			tableName = "[LU].[OrderStatus]";
			if (Database.TableExists(tableName))
			{
				string[] columns = { "Name", "Language", "Value", "Favorite", "SortOrder", "Color" };
				InsertLookupValue(tableName, columns, "'Abierto', 'es', 'Open', 0, 0, '#4CAF50'");
				InsertLookupValue(tableName, columns, "'Cerrado', 'es', 'Closed', 0, 1, '#F44336'");
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