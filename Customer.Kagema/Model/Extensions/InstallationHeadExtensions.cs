using Crm.Library.BaseModel;
using Crm.Service.Model;

namespace Customer.Kagema.Model.Extensions
{
	public class InstallationHeadExtensions : EntityExtension<Installation>
	{
		public virtual string ShipToCode { get; set; }
		public virtual string MotorTyp { get; set; }
		public virtual string MotorNummer { get; set; }
		public virtual string GeneratorTyp { get; set; }
		public virtual string GeneratorNummer { get; set; }
		public virtual string PumpeTyp { get; set; }
		public virtual string PumpeNummer { get; set; }
		public virtual string KagemaStandort { get; set; }

	}
}
