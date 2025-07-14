namespace Crm.Service.Model.Lookup
{
	using Crm.Library.Api.Attributes;
	using Crm.Library.Globalization.Lookup;

	[Lookup("[SMS].[MonitoringDataType]")]
	public class MonitoringDataType : EntityLookup<string>
	{
		[RestrictedField]
        public virtual int MonitoringDataTypeId { get; set; }
		[RestrictedField]
		public virtual string DataTypeKey { get; set; }
		[RestrictedField]
		public virtual double? Min { get; set; }
		[RestrictedField]
		public virtual double? Max { get; set; }
		[RestrictedField]
		public virtual int? BitIndex { get; set; }
		[RestrictedField]
		public virtual string QuantityUnit { get; set; }
	}
}
