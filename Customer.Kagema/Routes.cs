namespace Customer.Kagema
{
    using Crm.Library.Modularization.Registrars;
    using Crm.Library.Routing.Constraints;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Routing;

    public class Routes : IRouteRegistrar
    {
        public RoutePriority Priority => RoutePriority.Normal;
        public void RegisterRoutes(IEndpointRouteBuilder endpoints)
        {
            endpoints.MapControllerRoute(
                null,
                "{plugin}/{controller}/{action}/{id}",
                new { action = "Index", id = 0 },
                new { plugin = new IsCurrentPluginName(new KagemaPlugin()) },
                new[] { "Customer.Kagema.Controllers" }
            );
        }
    }
}