namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20190920200000)]
	public class AddPrimaryKeyServiceOrderChecklist : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('[SMS].[ServiceOrderChecklist]') AND is_primary_key = 1)
			BEGIN
				ALTER TABLE [SMS].[ServiceOrderChecklist]
				ADD CONSTRAINT [PK_ServiceOrderChecklist] PRIMARY KEY (DynamicFormReferenceKey)
			END");
		}
	}
}