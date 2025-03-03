namespace Sms.Scheduler.Model
{
	using System;
	using System.Collections.Generic;
	using System.ComponentModel;
	using System.ComponentModel.DataAnnotations;

	using Crm.Library.BaseModel;
	using Crm.Library.Model;
	using Crm.Service.Rest.Model;

	using NJsonSchema.Annotations;

	public class Profile : EntityBase<int>
	{
		public virtual Guid InternalId { get; set; }
		public virtual string Username { get; set; }
		public virtual string Name { get; set; }
		public virtual bool DefaultProfile { get; set; }
		public virtual string ClientConfig { get; set; }

		/// <summary>
		/// This property is used for loading / deserializing and may contain empty elements
		/// If you want to make sure you have only valid person entries use ActivePerson collection
		/// instead.
		/// </summary>

		//public virtual ICollection<PipelineFilter> PipelineFilters { get; set; }
		public virtual int TemplateKey { get; set; }
		public virtual User User { get; set; }

		public virtual ICollection<string> ResourceKeys { get; set; }

		public Profile()
		{
			InternalId = Guid.NewGuid();
		}

		protected bool Equals(Profile other)
		{
			return base.Equals(other) && string.Equals(Username, other.Username) && DefaultProfile.Equals(other.DefaultProfile);
		}
		public override bool Equals(object obj)
		{
			if (ReferenceEquals(null, obj))
			{
				return false;
			}

			if (ReferenceEquals(this, obj))
			{
				return true;
			}

			if (obj.GetType() != this.GetType())
			{
				return false;
			}

			return Equals((Profile)obj);
		}
		public override int GetHashCode()
		{
			unchecked
			{
				int hashCode = base.GetHashCode();
				hashCode = (hashCode * 397) ^ (Username != null ? Username.GetHashCode() : 0);
				hashCode = (hashCode * 397) ^ DefaultProfile.GetHashCode();
				return hashCode;
			}
		}
	}

	public class ClientConfig
	{
		[Required, Range(15, 20), DefaultValue(15)]
		public int ResourceRowHeight { get; set; }
		[ItemsCanBeNull, DefaultValue(new[]
		{
			"Resource.DisplayName",
			"Resource.Email",
			"#.#",
			"Resource.Skills",
			"Resource.Capacity",
			"#.#",
			"Resource.License"
		})]
		public string[] ResourceTooltip { get; set; }
		[ItemsCanBeNull, DefaultValue(new[]
		{
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.OrderNo)}",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.Company)}",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.ErrorMessage)}",
			"#.#",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.City)}",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.ZipCode)}",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.Street)}",
			"ServiceOrder.Country",
			"#.#",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.Dispatches)}",
			"#.#",
			"ServiceOrder.Skills"
		})]
		public string[] ServiceOrderTooltip { get; set; }
		[ItemsCanBeNull, DefaultValue(new[]
		{
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.OrderNo)}",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.Company)}",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.ErrorMessage)}",
			"#.#",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.City)}",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.ZipCode)}",
			$"ServiceOrder.{nameof(ServiceOrderHeadRest.Street)}",
			"ServiceOrder.Country",
			"#.#",
			$"ServiceOrderDispatch.{nameof(ServiceOrderDispatchRest.Date)}",
			$"ServiceOrderDispatch.{nameof(ServiceOrderDispatchRest.EndDate)}",
			$"ServiceOrderDispatch.{nameof(ServiceOrderDispatchRest.NetWorkMinutes)}",
			"#.#",
			$"ServiceOrderDispatch.{nameof(ServiceOrderDispatchRest.ModifyDate)}",
			$"ServiceOrderDispatch.{nameof(ServiceOrderDispatchRest.ModifyUser)}"
		})]
		public string[] ServiceOrderDispatchTooltip { get; set; }
		[ItemsCanBeNull]
		public HourSpan[] NonWorkingHours { get; set; }
		[Required, DefaultValue(true)]
		public bool EnablePlanningConfirmations { get; set; }
		[DefaultValue(14)]
		public decimal LowerBound { get; set; }
		[DefaultValue(62)]
		public decimal UpperBound { get; set; }
		[DefaultValue(new string[] { })]
		public string[] PipelineGroup { get; set; }

		[DefaultValue(new string[] { })]
		public string[] ResourceGroup { get; set; }

		[DefaultValue(new string[] { "#0000ff", "#ff0000", "#039422", "#ff6f00", "#ffff00" })]
		public string[] RouteColors { get; set; }
		[Required, DefaultValue(false)]
		public bool LoadClosedServiceOrders { get; set; }

		[Required, Range(30, 480), DefaultValue(120)]
		public int ServiceOrderDispatchDefaultDuration { get; set; }

		[CanBeNull]
		public int? ServiceOrderDispatchMaximumDuration { get; set; }

		public bool ServiceOrderDispatchIgnoreCalculatedDuration { get; set; }

		public bool ServiceOrderDispatchForceMaximumDuration { get; set; }
		[Required, DefaultValue(true)]
		public bool AllowSchedulingForPast { get; set; }

		[DefaultValue("ServiceOrder.Company")]
		public string PipelineFirstLine { get; set; }
		public string PipelineSecondLine { get; set; }
		[DefaultValue(new string[] { $"ServiceOrder.{nameof(ServiceOrderHeadRest.OrderNo)}" } )]
		public string[] DataForFirstRow { get; set; }
		[DefaultValue(new string[] { })]
		public string[] DataForSecondRow { get; set; }
		[DefaultValue(new string[] { })]
		public string[] DataForThirdRow { get; set; }
	}

	public struct HourSpan
	{
		[Range(0, 24)]
		public int From { get; set; }
		[Range(0, 24)]
		public int To { get; set; }
	}
}
