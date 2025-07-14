namespace Crm.Service.Model.Maps
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	public class ServiceOrderMaterialSerialMap : EntityClassMapping<ServiceOrderMaterialSerial>
	{
		public ServiceOrderMaterialSerialMap()
		{
			Schema("SMS");
			Table("ServiceOrderMaterialSerials");

			Id(x => x.Id, map =>
				{
					map.Column("Id");
					map.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
					map.UnsavedValue(Guid.Empty);
				});

			Property(x => x.OrderMaterialId);
			ManyToOne(x => x.ServiceOrderMaterial,
							m =>
							{
								m.Column("OrderMaterialId");
								m.Fetch(FetchKind.Select);
								m.Insert(false);
								m.Update(false);
							});

			Property(x => x.SerialNo);
			Property(x => x.PreviousSerialNo);
			Property(x => x.IsInstalled);

			Property(x => x.NoPreviousSerialNoReasonKey, m => m.Column("NoPreviousSerialNoReason"));
		}
	}
}