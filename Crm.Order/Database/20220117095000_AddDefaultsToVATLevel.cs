namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20220117095000)]
	public class AddDefaultsToVATLevel : Migration
	{
		public override void Up()
		{
			Insert("Standard", "en", "A", "19", "100");
			Insert("Standard", "de", "A", "19", "100");
			Insert("Standard", "fr", "A", "19", "100");
			Insert("Estándar", "es", "A", "19", "100");
			Insert("Standard", "hu", "A", "19", "100");

			Insert("Reduced", "en", "B", "7", "100");
			Insert("Reduziert", "de", "B", "7", "100");
			Insert("Réduit", "fr", "B", "7", "100");
			Insert("Reducida", "es", "B", "7", "100");
			Insert("Csökkentett", "hu", "B", "7", "100");

			Insert("Zero", "en", "C", "0", "100");
			Insert("Null", "de", "C", "0", "100");
			Insert("Zéro", "fr", "C", "0", "100");
			Insert("Cero", "es", "C", "0", "100");
			Insert("Nulla", "hu", "C", "0", "100");
		}

		private void Insert(string name, string language, string value, string percentage, string countryKey)
		{
			Database.Insert("[LU].[VATLevel]", new string[] { "Name", "Language", "Favorite", "SortOrder", "Value", "PercentageValue", "CreateUser", "ModifyUser", "CountryKey" },
				new string[] { name, language, "0", "0", value, percentage, "Setup", "Setup", countryKey });
		}
	}
}
