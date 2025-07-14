namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20240220111200)]
	public class IncreaseOrderItemQuantityUnitSize : Migration
	{
		public override void Up()
		{
			const string schema = "CRM";
			const string table = "OrderItem";
			const string column = "QuantityUnitKey";

			if (Database.ColumnExists($"[{schema}].[{table}]", column))
			{
				var length = (int)Database.ExecuteScalar(
					$@"	SELECT CHARACTER_MAXIMUM_LENGTH
						FROM INFORMATION_SCHEMA.COLUMNS
						WHERE TABLE_SCHEMA = '{schema}' AND
							TABLE_NAME = '{table}' AND
							COLUMN_NAME = '{column}'");
				if (length < 20)
				{
					Database.ExecuteNonQuery($"ALTER TABLE [{schema}].[{table}] ALTER COLUMN [{column}] NVARCHAR(20) not null");
				}
			}
		}
	}
}
