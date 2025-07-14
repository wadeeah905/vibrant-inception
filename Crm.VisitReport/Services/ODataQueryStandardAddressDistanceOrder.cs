namespace Crm.VisitReport.Services
{
	using System.Globalization;
	using System.Linq;

	using Crm.Library.Api.Controller;
	using Crm.Library.AutoFac;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Model;

	using Microsoft.AspNetCore.OData.Query;

	public class ODataQueryStandardAddressDistanceOrder : IODataQueryFunction, IDependency
	{
		public virtual IQueryable<T> Apply<T, TRest>(ODataQueryOptions<TRest> options, IQueryable<T> query)
			where T : class, IEntityWithId
			where TRest : class
		{
			var parameters = options.Request.Query;
			var latitudeString = parameters["orderByStandardAddressDistanceLatitude"].ToString()?.Trim();
			var longitudeString = parameters["orderByStandardAddressDistanceLongitude"].ToString()?.Trim();
			var fudgeString = parameters["orderByStandardAddressDistanceFudge"].ToString()?.Trim();
			if (!string.IsNullOrWhiteSpace(latitudeString) && !string.IsNullOrWhiteSpace(longitudeString) && !string.IsNullOrWhiteSpace(fudgeString) && double.TryParse(latitudeString, NumberStyles.Float | NumberStyles.AllowThousands, NumberFormatInfo.InvariantInfo, out var latitude) && double.TryParse(longitudeString, NumberStyles.Float | NumberStyles.AllowThousands, NumberFormatInfo.InvariantInfo, out var longitude) && double.TryParse(fudgeString, NumberStyles.Float | NumberStyles.AllowThousands, NumberFormatInfo.InvariantInfo, out var fudge))
			{
				return (IQueryable<T>)((IQueryable<Company>)query).OrderBy(x => (latitude - x.StandardAddress.Latitude) * (latitude - x.StandardAddress.Latitude) + (longitude - x.StandardAddress.Longitude) * (longitude - x.StandardAddress.Longitude) * fudge);
			}

			return query;
		}
	}
}
