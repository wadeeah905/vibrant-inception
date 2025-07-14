namespace Crm.VisitReport
{
	using Crm.Library.Modularization.Registrars;

	using Microsoft.AspNetCore.Builder;
	using Microsoft.AspNetCore.Routing;

	public class Routes : IRouteRegistrar
	{
		public virtual RoutePriority Priority => RoutePriority.AboveNormal;
		public virtual void RegisterRoutes(IEndpointRouteBuilder endpoints)
		{
			endpoints.MapControllerRoute(
				null,
				"Crm.VisitReport/{controller}/{action}/{id?}",
				new { action = "Index", plugin = "Crm.VisitReport" },
				new { plugin = "Crm.VisitReport" }
			);
		}
	}
}
