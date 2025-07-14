namespace Crm.Order.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	public class BaseOrderMap : EntityClassMapping<BaseOrder>
	{
		public BaseOrderMap()
		{
			Schema("CRM");
			Table("`Order`");
			Discriminator(x => x.Column("OrderType"));

			Id(x => x.Id,
				m =>
				{
					m.Column("OrderId");
					m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
					m.UnsavedValue(Guid.Empty);
				});
			Property(x => x.LegacyId);
			Property(x => x.OrderNo);
			Property(x => x.SendConfirmation);
			Property(x => x.ConfirmationSendingError, m => m.Length(int.MaxValue));
			Property(x => x.ConfirmationSent);
			Property(x => x.DocumentNo);
			Property(x => x.OrderDate);
			Property(x => x.DeliveryDate);
			Property(x => x.StatusKey);
			Property(x => x.OrderCategoryKey);
			Property(x => x.OrderEntryType);
			Property(x => x.ReadyForExport);
			Property(x => x.IsExported);
			Property(x => x.ResponsibleUser);
			Property(x => x.ContactId, m => m.Column("BusinessPartnerContactKey"));
			Property(x => x.ContactName, m => m.Column("BusinessPartnerName"));
			Property(x => x.ContactAddressId, m => m.Column("BusinessPartnerAddressKey"));
			Property(x => x.ContactAddressStreet, m => m.Column("BusinessPartnerStreet"));
			Property(x => x.ContactAddressZipCode, m => m.Column("BusinessPartnerZipCode"));
			Property(x => x.ContactAddressCity, m => m.Column("BusinessPartnerCity"));
			Property(x => x.DeliveryAddressId, m => m.Column("DeliveryAddressKey"));
			Property(x => x.DeliveryAddressName, m => m.Column("DeliveryAddressName"));
			Property(x => x.DeliveryAddressStreet, m => m.Column("DeliveryAddressStreet"));
			Property(x => x.DeliveryAddressZipCode, m => m.Column("DeliveryAddressZipCode"));
			Property(x => x.DeliveryAddressCity, m => m.Column("DeliveryAddressCity"));
			Property(x => x.BillingAddressId, m => m.Column("BillAddressKey"));
			Property(x => x.BillingAddressName, m => m.Column("BillAddressName"));
			Property(x => x.BillingAddressStreet, m => m.Column("BillAddressStreet"));
			Property(x => x.BillingAddressZipCode, m => m.Column("BillAddressZipCode"));
			Property(x => x.BillingAddressCity, m => m.Column("BillAddressCity"));
			Property(x => x.ContactPersonId, m => m.Column("ContactPerson"));
			Property(x => x.ExportDate);
			Property(x => x.Price);
			Property(x => x.CustomEmail);
			Property(x => x.CustomFax);
			Property(x => x.CommunicationType);
			Property(x => x.Discount);
			Property(x => x.DiscountType);
			Property(x => x.PrivateDescription);
			Property(x => x.PublicDescription);
			Property(x => x.Representative);
			Property(x => x.CustomerOrderNumber);
			Property(x => x.Comission);
			Property(x => x.CurrencyKey);
			Property(x => x.Signature, m =>
			{
				m.Column("Signature");
				m.Length(10000);
			});
			Property(x => x.SignatureDate);
			Property(x => x.SignatureName);
			Property(x => x.SignPrivacyPolicyAccepted);
			Property(x => x.Visibility);

			ManyToOne(x => x.Company, map =>
			{
				map.Column("BusinessPartnerContactKey");
				map.Cascade(Cascade.None);
				map.Insert(false);
				map.Update(false);
			});
			ManyToOne(x => x.ContactPerson, map =>
			{
				map.Column("ContactPerson");
				map.Fetch(FetchKind.Select);
				map.Lazy(LazyRelation.Proxy);
				map.Cascade(Cascade.None);
				map.Insert(false);
				map.Update(false);
			});
			ManyToOne(x => x.ResponsibleUserObject,
				m =>
				{
					m.Column("ResponsibleUser");
					m.Fetch(FetchKind.Select);
					m.Insert(false);
					m.Update(false);
				});

			this.EntitySet(x => x.VisibleToUserIds, map =>
			{
				map.Schema("CRM");
				map.Table("OrderUser");
				map.Key(km => km.Column("OrderKey"));
				map.Fetch(CollectionFetchMode.Select);
				map.Lazy(CollectionLazy.Lazy);
				map.Cascade(Cascade.Persist);
				map.BatchSize(250);
			}, r => r.Element(m => m.Column("Username")));

			this.EntitySet(x => x.VisibleToUsergroupIds, map =>
			{
				map.Schema("CRM");
				map.Table("OrderUserGroup");
				map.Key(km => km.Column("OrderKey"));
				map.Fetch(CollectionFetchMode.Select);
				map.Lazy(CollectionLazy.Lazy);
				map.Cascade(Cascade.Persist);
				map.BatchSize(250);
			}, r => r.Element(m => m.Column("UserGroupKey")));
			this.EntitySet(x => x.CalculationPositions,
				m =>
				{
					m.Key(km => km.Column("OrderKey"));
					m.Cascade(Cascade.None);
					m.Inverse(true);
					m.Fetch(CollectionFetchMode.Select);
					m.BatchSize(100);
					m.Lazy(CollectionLazy.NoLazy);
				},
				a => a.OneToMany());
			this.EntitySet(x => x.Items,
				m =>
				{
					m.Key(km => km.Column("OrderKey"));
					m.Cascade(Cascade.None);
					m.Inverse(true);
					m.Fetch(CollectionFetchMode.Select);
					m.BatchSize(100);
					m.Lazy(CollectionLazy.NoLazy);
				},
				a => a.OneToMany());
		}
	}
}
