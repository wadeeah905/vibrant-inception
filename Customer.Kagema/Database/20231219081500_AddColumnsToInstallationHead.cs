namespace Customer.Kagema.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20231219080400)]
	public class AddNewColumnsToSmsInstallation : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("SMS.InstallationHead", new Column("MotorTyp", DbType.String, 255, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("SMS.InstallationHead", new Column("MotorNummer", DbType.String, 255, ColumnProperty.Null));
		
			Database.AddColumnIfNotExisting("SMS.InstallationHead", new Column("GeneratorTyp", DbType.String, 255, ColumnProperty.Null));
		
			Database.AddColumnIfNotExisting("SMS.InstallationHead", new Column("GeneratorNummer", DbType.String, 255, ColumnProperty.Null));
		
			Database.AddColumnIfNotExisting("SMS.InstallationHead", new Column("PumpeTyp", DbType.String, 255, ColumnProperty.Null));
		
			Database.AddColumnIfNotExisting("SMS.InstallationHead", new Column("PumpeNummer", DbType.String, 255, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("SMS.InstallationHead", new Column("KagemaStandort", DbType.String, 255, ColumnProperty.Null));
		
		}
	}
}
