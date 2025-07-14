namespace Sms.Checklists.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150918110600)]
	public class RemoveChecklistsFromRemovedServiceOrderTimes : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("UPDATE [CRM].[DynamicFormReference] " +
			                         "SET [IsActive] = 0, [ModifyDate] = GETUTCDATE() " +
			                         "FROM [CRM].[DynamicFormReference] " +
			                         "JOIN [SMS].[ServiceOrderChecklist] ON [CRM].[DynamicFormReference].[DynamicFormReferenceId] = [SMS].[ServiceOrderChecklist].[DynamicFormReferenceKey] " +
			                         "JOIN [SMS].[ServiceOrderTimes] ON [SMS].[ServiceOrderChecklist].[ServiceOrderTimeKey] = [SMS].[ServiceOrderTimes].[Id] " +
			                         "WHERE [SMS].[ServiceOrderTimes].[IsActive] = 0 AND [CRM].[DynamicFormReference].[IsActive] = 1");
		}
	}
}