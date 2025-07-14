namespace Sms.Checklists
{

	using Crm.Library.Modularization.Registrars;

	using Microsoft.AspNetCore.Builder;
	using Microsoft.AspNetCore.Routing;

	public class Routes : IRouteRegistrar
	{
		public virtual RoutePriority Priority
		{
			get { return RoutePriority.AboveNormal; }
		}
		public virtual void RegisterRoutes(IEndpointRouteBuilder endpoints)
		{
			// Add additional routes here

			endpoints.MapControllerRoute(
				null,
				"Sms.Checklists/{controller}/{action}/{id?}",
				new { action = "Index", plugin = "Sms.Checklists" },
				new { plugin = "Sms.Checklists" }
				);
		}
	}
}
