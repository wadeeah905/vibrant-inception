namespace Crm.Service.EventHandler
{
	using System.Collections.Generic;
	
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Modularization.Events;
	using Crm.Model;
	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;
	using Crm.Services.Interfaces;

	public class DispatchPushNotifier : IEventHandler<EntityCreatedEvent<ServiceOrderDispatch>>, IEventHandler<EntityModifiedEvent<ServiceOrderDispatch>>, IEventHandler<EntityDeletedEvent<ServiceOrderDispatch>>
	{
		private readonly IPushNotificationService pushNotificationService;
		private readonly ILookupManager lookupManager;

		public DispatchPushNotifier(IPushNotificationService pushNotificationService, ILookupManager lookupManager)
		{
			this.pushNotificationService = pushNotificationService;
			this.lookupManager = lookupManager;
		}

		public virtual void Handle(EntityCreatedEvent<ServiceOrderDispatch> e)
		{
			var dispatch = e.Entity;
			if (dispatch.Status.IsReleased())
			{
				SendDispatchCreatedPushNotification(dispatch);
			}
		}

		public virtual void Handle(EntityModifiedEvent<ServiceOrderDispatch> e)
		{
			var dispatch = e.Entity;
			var dispatchBeforeChange = e.EntityBeforeChange;
			var releasedStatus = lookupManager.Get<ServiceOrderDispatchStatus>("Released");
			var completedStatus = lookupManager.Get<ServiceOrderDispatchStatus>("ClosedNotComplete");
			if (dispatch.Status.IsReleased() && dispatchBeforeChange.Status.IsScheduled())
			{
				SendDispatchCreatedPushNotification(dispatch);
			}
			else if (dispatch.Status.SortOrder >= releasedStatus.SortOrder && dispatch.Status.SortOrder <= completedStatus.SortOrder && dispatchBeforeChange.Status.SortOrder >= releasedStatus.SortOrder && dispatchBeforeChange.Status.SortOrder <= completedStatus.SortOrder && (dispatch.Date.Date != dispatchBeforeChange.Date.Date || dispatch.Time.TimeOfDay != dispatchBeforeChange.Time.TimeOfDay))
			{
				SendDispatchRescheduledPushNotification(dispatch, dispatchBeforeChange);
			}
			else if (dispatch.Status.IsScheduled() && dispatchBeforeChange.Status.IsReleased())
			{
				SendDispatchRemovedPushNotification(dispatch);
			}
		}

		public virtual void Handle(EntityDeletedEvent<ServiceOrderDispatch> e)
		{
			var dispatch = e.Entity;
			var releasedStatus = lookupManager.Get<ServiceOrderDispatchStatus>("Released");
			var completedStatus = lookupManager.Get<ServiceOrderDispatchStatus>("ClosedNotComplete");
			if (dispatch.Status.SortOrder >= releasedStatus.SortOrder && dispatch.Status.SortOrder <= completedStatus.SortOrder)
			{
				SendDispatchRemovedPushNotification(dispatch);
			}
		}

		protected virtual void SendDispatchCreatedPushNotification(ServiceOrderDispatch dispatch)
		{
			var notification = new PushNotification()
			{
				Usernames = new [] { dispatch.DispatchedUser.Id },
				TitleResourceKey = "Dispatch",
				BodyResourceKey = "DispatchCreatedText",
				BodyResourceParams = new List<string> {dispatch.OrderHead.OrderNo, dispatch.Date.ToShortDateString(), dispatch.Time.ToShortTimeString() },
				Url = $"~/Home/MaterialIndex#/Crm.Service/Dispatch/DetailsTemplate/{dispatch.Id}"
			};
			pushNotificationService.SendPushNotification(notification);
		}
		protected virtual void SendDispatchRescheduledPushNotification(ServiceOrderDispatch dispatch, ServiceOrderDispatch dispatchBeforeChange)
		{
			
			var notification = new PushNotification()
			{
				Usernames = new [] { dispatch.DispatchedUser.Id },
				TitleResourceKey = "Dispatch",
				BodyResourceKey = "DispatchRescheduledText",
				BodyResourceParams = new List<string> {dispatch.OrderHead.OrderNo, dispatch.Date.ToShortDateString(), dispatch.Time.ToShortTimeString(), dispatchBeforeChange.Date.ToShortDateString(), dispatchBeforeChange.Time.ToShortTimeString() },
				Url = $"~/Home/MaterialIndex#/Crm.Service/Dispatch/DetailsTemplate/{dispatch.Id}"
			};
			pushNotificationService.SendPushNotification(notification);
		}
		protected virtual void SendDispatchRemovedPushNotification(ServiceOrderDispatch dispatch)
		{
			var notification = new PushNotification()
			{
				Usernames = new [] { dispatch.DispatchedUser.Id },
				TitleResourceKey = "Dispatch",
				BodyResourceKey = "DispatchRemovedText",
				BodyResourceParams = new List<string> {dispatch.OrderHead.OrderNo, dispatch.Date.ToShortDateString(), dispatch.Time.ToShortTimeString() }
			};
			pushNotificationService.SendPushNotification(notification);
		}
	}
}
