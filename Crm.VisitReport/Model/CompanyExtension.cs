namespace Crm.VisitReport.Model
{
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Attributes;
	using Crm.Model;
	using Crm.Model.Lookups;

	public class CompanyExtension : EntityExtension<Company>
	{
		[UI(Caption = "VisitsNeeded", Row = 1, ColumsPerRow = 4)]
		[Database(Column = "VisitFrequencyValue")]
		public int VisitFrequencyValue { get; set; }

		[UI(Hidden = true)]
		[Database(Formula = "(SELECT TOP 1 VisitFrequencyValue * tu.TimeUnitsPerYear FROM LU.TimeUnit tu WHERE tu.Value = VisitFrequencyTimeUnitKey)")]
		[ReadOnlyExtensionProperty]
		public int? VisitFrequencyValuePerYear { get; set; }

		[LookupKey(Type = typeof(TimeUnit))]
		[LookupFilter(MethodName = "OnlyTimeUnitsWithTimeUnitsPerYear", LookupType = typeof(TimeUnit))]
		[Database(Column = "VisitFrequencyTimeUnitKey")]
		[UI(Caption = "VisitsNeededTimeUnit", Row = 1, ColumsPerRow = 4)]
		public string VisitFrequencyTimeUnitKey { get; set; }

		public bool OnlyTimeUnitsWithTimeUnitsPerYear(TimeUnit timeUnit)
		{
			return timeUnit.TimeUnitsPerYear.HasValue;
		}
	}
}
