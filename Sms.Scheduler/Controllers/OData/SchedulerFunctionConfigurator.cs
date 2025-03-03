﻿namespace Sms.Scheduler.Controllers.OData
{
	using System;

	using Crm.Library.Api.Model;
	using Crm.Service.Rest.Model;

	using Sms.Scheduler.Model;
	using Sms.Scheduler.Rest.Model;

	using ODataConventionModelBuilder = Crm.Library.Api.Model.ODataConventionModelBuilder;

	public class SchedulerFunctionConfigurator : IModelConfigurator
	{
		private readonly ODataModelBuilderHelper modelHelper;
		public SchedulerFunctionConfigurator(ODataModelBuilderHelper modelHelper)
		{
			this.modelHelper = modelHelper;
		}
		public virtual void Configure(ODataConventionModelBuilder builder)
		{
			var getGroupableProperties = builder.EntityType<ServiceOrderHeadRest>()
				.Collection
				.Function(nameof(ServiceOrderODataController.GetGroupableProperties))
				.ReturnsCollection<string>();
			getGroupableProperties.Title = $"gets groupable serviceorder properties";

			var getResourceGroupableProperties = builder.EntityType<ProfileRest>()
				.Collection
				.Function(nameof(ProfileODataController.GetGroupableResourceProperties))
				.ReturnsCollection<string>();
			getResourceGroupableProperties.Title = $"gets groupable resource properties";

			var getDefaultProfileConfig = builder.EntityType<ProfileRest>()
				.Collection
				.Function(nameof(ProfileODataController.GetDefaultProfileConfig))
				.Returns<ClientConfig>();
			getDefaultProfileConfig.Title = $"gets default clientconfig for new profiles";

			var getDispatchesInRange = builder.EntityType<ServiceOrderDispatchRest>()
				.Collection
				.Action(nameof(DispatchODataController.GetDispatchesInRange))
				.ReturnsCollection<Guid>();
			getDispatchesInRange.CollectionParameter<string>("technicians");
			getDispatchesInRange.Parameter<DateTime>("startDate");
			getDispatchesInRange.Parameter<DateTime>("endDate");
			getDispatchesInRange.Title = "Get dispatches in range";
		}
	}
}
