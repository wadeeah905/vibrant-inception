namespace Customer.Kagema.Model.Mappings
{
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.BaseModel.Mappings;



	public class ServiceOrderExportErrorsMap : EntityClassMapping<ServiceOrderExportErrors>
	{
		public ServiceOrderExportErrorsMap()
		{

			Schema("SMS");
			Table("ServiceOrderHead");

			Property(x => x.OrderNo);
			Property(x => x.ExportDetails);

		}
	}
}

