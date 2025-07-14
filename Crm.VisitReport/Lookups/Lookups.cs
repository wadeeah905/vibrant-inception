namespace Crm.VisitReport.Lookups
{
	using Crm.Library.Globalization.Lookup;

	[Lookup("[LU].[ContactPersonRelationshipType]")]
	public class ContactPersonRelationshipType : EntityLookup<string>
	{
		public static readonly ContactPersonRelationshipType OwnEmployee = new ContactPersonRelationshipType { Key = "101" };
		public static readonly ContactPersonRelationshipType Participant = new ContactPersonRelationshipType { Key = "100" };
	}

	#region VisitAim

	[Lookup("[LU].[VisitAim]", "VisitAimId")]
	public class VisitAim : EntityLookup<string>, ILookupWithColor
	{
		public VisitAim()
		{
			Color = "#9E9E9E";
		}

		[LookupProperty(Shared = true)]
		public virtual string Color { get; set; }
	}

	#endregion

	#region VisitStatus

	[Lookup("[LU].[VisitStatus]", "VisitStatusId")]
	public class VisitStatus : EntityLookup<string>, ILookupWithSettableStatuses
	{
		public const string CreatedKey = "Created";
		public const string ScheduledKey = "Scheduled";
		public const string InProgressKey = "InProgress";
		public const string CompletedKey = "Completed";

		[LookupProperty(Shared = true)]
		public virtual string SettableStatuses { get; set; }
	}

	#endregion
}