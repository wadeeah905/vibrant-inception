namespace Crm.Service.Services
{
	using System;
	using System.Collections;

	using Crm.Library.Api.Formatting;
	using Crm.Library.Api.Mapping;
	using Crm.Library.Api.Model;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Rest;
	using Crm.Rest.Model;
	using Crm.Service.Model;
	using Crm.Service.Rest.Model;

	using Microsoft.AspNetCore.OData.Formatter.Serialization;

	public class ODataDynamicExtensionValueSerializer : IODataDynamicExtensionValueSerializer
	{
		public virtual void Serialize(ODataSerializerContext context, IDictionary source, BaseODataExtensionValues target)
		{
			const string parameterName = "expandDocumentAttributeExtension";
			var parameters = context.Request.Query;
			if (parameters.Keys.Contains(parameterName)
				&& context.ExpandedResource?.ResourceInstance is DocumentAttributeRest rest
				&& rest.ExtensionValues[nameof(DocumentAttributeExtension.ServiceOrderTimeId)] is Guid serviceOrderTimeId)
			{
				var repository = context.Request.HttpContext.GetService<IRepositoryWithTypedId<ServiceOrderTime, Guid>>();
				var serviceOrderTime = repository.Get(serviceOrderTimeId);
				if (serviceOrderTime != null)
				{
					var mapper = context.Request.HttpContext.GetService<IODataMapper>();
					var serializer = context.Request.HttpContext.GetService<IRestSerializer>();
					target.DynamicProperties.Add("ServiceOrderTime", serializer.SerializeAsJson(mapper.Map<ServiceOrderTimeRest>(serviceOrderTime)));
					target.DynamicProperties.Add("ServiceOrderTimeInstallation", serializer.SerializeAsJson(mapper.Map<InstallationRest>(serviceOrderTime.Installation)));
				}
			}
		}
	}
}
