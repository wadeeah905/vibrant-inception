﻿namespace Sms.Scheduler.Services
{
	using Microsoft.AspNetCore.Mvc;
	using Crm.Library.MobileViewEngine;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.Interfaces;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Services;
	using Crm.Services.Interfaces;

	using Main.Services;
	using Main.Services.Interfaces;

	using Sms.Scheduler.Controllers;

	public class SchedulerRedirectProvider : IRedirectProvider
	{
		private static readonly string SchedulerUrl = $"~/Home/MaterialIndex#/{SchedulerPlugin.PluginName}/{SchedulerController.Name}{nameof(SchedulerController.DetailsTemplate)}";
		private readonly IAuthorizationManager authorizationManager;
		public SchedulerRedirectProvider(IAuthorizationManager authorizationManager)
		{
			this.authorizationManager = authorizationManager;
		}
		protected virtual bool IsAllowed(User user, IBrowserCapabilities browserCapabilities)
		{
			if (browserCapabilities.IsMobileDevice == false && authorizationManager.IsAuthorizedForAction(user, PermissionGroup.Login, SchedulerPlugin.PermissionName.SchedulerClient))
			{
				return true;
			}
			return false;
		}
		public ActionResult RedirectAfterLogin(User user, IBrowserCapabilities browserCapabilities, string returnUrl)
		{
			if (authorizationManager.IsAuthorizedForAction(user, PermissionGroup.Login, SchedulerPlugin.PermissionName.SchedulerClient))
			{
				return new RedirectResult(SchedulerUrl);
			}
			return null;
		}

		public string AvailableClients(User user) {
			return authorizationManager.IsAuthorizedForAction(user, PermissionGroup.Login, SchedulerPlugin.PermissionName.SchedulerClient) ? SchedulerPlugin.PermissionName.SchedulerClient : null;
		}

		public RedirectProviderResult Index(User user, IBrowserCapabilities browserCapabilities)
		{
			if (IsAllowed(user, browserCapabilities))
			{
				return new RedirectProviderResult
				{
					Name = "WebScheduler",
					// Plugin = SchedulerPlugin.PluginName,
					// Controller = SchedulerController.Name,
					// Action = nameof(SchedulerController.DetailsTemplate),
					Plugin = "Main",
					Controller = "Home",
					Action = "MaterialIndex?redirectUrl=#/Sms.Scheduler/Scheduler/DetailsTemplate",
					ActionResult = x => new RedirectResult(SchedulerUrl),
					Icon = "desktop-windows"
				};
			}
			return null;
		}
	}
}
