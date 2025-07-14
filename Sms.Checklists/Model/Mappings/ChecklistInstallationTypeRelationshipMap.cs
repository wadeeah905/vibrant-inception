namespace Sms.Checklists.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	public class ChecklistInstallationTypeRelationshipMap : EntityClassMapping<ChecklistInstallationTypeRelationship>
	{
		public ChecklistInstallationTypeRelationshipMap()
		{
			Schema("SMS");
			Table("ChecklistInstallationTypeRelationship");

			Id(a => a.Id, m =>
			{
				m.Column("ChecklistInstallationTypeRelationshipId");
				m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
				m.UnsavedValue(Guid.Empty);
			});
			Property(x => x.RequiredForServiceOrderCompletion);
			Property(x => x.SendToCustomer);

			Property(x => x.ServiceOrderTypeKey);
			Property(x => x.InstallationTypeKey);

			Property(x => x.DynamicFormKey);
			ManyToOne(x => x.DynamicForm, m =>
			{
				m.Column("DynamicFormKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});
		}
	}
}