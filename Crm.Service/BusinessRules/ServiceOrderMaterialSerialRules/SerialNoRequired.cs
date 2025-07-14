namespace Crm.Service.BusinessRules.ServiceOrderMaterialSerialRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.Service.Model;

	public class SerialNoRequired : RequiredRule<ServiceOrderMaterialSerial>
	{
		public SerialNoRequired()
		{
			Init(x => x.SerialNo);
		}
	}
}