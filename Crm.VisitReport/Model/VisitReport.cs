namespace Crm.VisitReport.Model
{
	using System;

	using Crm.DynamicForms.Model;
	using Crm.Library.Model;
	using Crm.Model;

	using Newtonsoft.Json;

	public class VisitReport : DynamicFormReference
	{
		[JsonIgnore]
		public virtual Company Company { get; set; }
		public virtual DateTime Date { get; set; }
		public virtual string ResponsibleUser { get; set; }
		public virtual User ResponsibleUserObject { get; set; }
		[JsonIgnore]
		public virtual Visit Visit { get; set; }
		public virtual Guid? VisitId { get; set; }
	}
}