namespace Customer.Kagema.Eventhandler
{
	using System;
	using System.Globalization;
	using System.Linq;
	using Sms.Einsatzplanung.Connector;
	using Crm.Library.AutoFac;

	using Crm.Service.Model;

	using Crm.Article.Services.Interfaces;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Helper;
	using Crm.Service.Model.Lookup;

	using log4net;

	using Microsoft.AspNetCore.Http;

	using Sms.Einsatzplanung.Connector.Model;

	using ArticleExtension = Sms.Einsatzplanung.Connector.Model.ArticleExtension;
	using Crm.Library.Modularization.Events;
	using Sms.Einsatzplanung.Connector.EventHandlers;
	using Microsoft.AspNetCore.Builder;

	public class CustomerRplTaskUpdater : IEventHandler<EntityCreatedEvent<ServiceOrderDispatch>>, IEventHandler<EntityModifiedEvent<ServiceOrderDispatch>>, IReplaceRegistration<RplTaskUpdater>
	{
		private readonly IRepository<RplDispatch> dispatchRplRepository;
		private readonly IRepositoryWithTypedId<RplTimePosting, Guid> timePostingRplRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderTimePosting, Guid> timePostingRepository;
		private readonly ILog logger;
		private readonly ILookupManager lookupManager;
		private readonly IAppSettingsProvider appSettingsProvider;
		private readonly Func<RplTimePosting> rplTimePostingFactory;
		private readonly Func<RplServiceOrderDispatch> rplServiceOrderDispatchFactory;
		private readonly IHttpContextAccessor httpContextAccessor;
		private readonly IArticleService articleService;


		protected virtual RplServiceOrderDispatch CreateNewRplServiceOrderDispatch(ServiceOrderDispatch dispatch)
		{
			var rplServiceOrderDispatch = rplServiceOrderDispatchFactory();
			rplServiceOrderDispatch.AuthData = dispatch.AuthData != null ? new LMobile.Unicore.EntityAuthData { DomainId = dispatch.AuthData.DomainId } : null;
			//rplServiceOrderDispatch.TechnicianInformation = rplServiceOrderDispatch.TechnicianInformation + (dispatch.Remark != null ? (" " + dispatch.Remark) : "");
			return rplServiceOrderDispatch;
		}
		protected virtual RplTimePosting CreateNewRplTimePosting(ServiceOrderDispatch dispatch)
		{
			var rplTimePosting = rplTimePostingFactory();
			rplTimePosting.AuthData = dispatch.AuthData != null ? new LMobile.Unicore.EntityAuthData { DomainId = dispatch.AuthData.DomainId } : null;
			return rplTimePosting;
		}
		// Methods
		public virtual void Handle(EntityCreatedEvent<ServiceOrderDispatch> e)
		{
			if (!UpdateRplTask())
			{
				return;
			}
			logger.InfoFormat("About to Create new RPL.Dispatch for SMS Dispatch {0}", e.Entity.Id);
			var dispatch = e.Entity;
			var dispatchRplTask = CreateNewRplServiceOrderDispatch(dispatch);
			SetDispatchRplTaskProperties(dispatchRplTask, dispatch);
			dispatchRplRepository.SaveOrUpdate(dispatchRplTask);
			logger.InfoFormat("Created new RPL.Dispatch for SMS Dispatch {0}", dispatch.Id);
		}

		public virtual void Handle(EntityModifiedEvent<ServiceOrderDispatch> e)
		{
			if (!UpdateRplTask())
			{
				return;
			}

			try
			{
				var dispatch = e.Entity;
				var dispatchBeforeChange = e.EntityBeforeChange;
				var serviceOrderDispatchTask = dispatchRplRepository.GetAll().FirstOrDefault(x => x.Dispatch.Id == dispatch.Id) ?? CreateNewRplServiceOrderDispatch(dispatch);
				var timePostingExportEnabled = appSettingsProvider.GetValue(EinsatzplanungConnectorPlugin.Settings.Export.TimePosting.Enabled);
				if (timePostingExportEnabled && (!dispatchBeforeChange.IsClosedComplete() && !dispatchBeforeChange.IsClosedNotComplete() && (dispatch.IsClosedComplete() || dispatch.IsClosedNotComplete())))
				{
					logger.InfoFormat("About to export time postings for dispatch {0}", dispatch.Id);
					ExportTimePostings(dispatch);
					serviceOrderDispatchTask.IsActive = false;
				}

				if (!dispatch.IsActive && serviceOrderDispatchTask.Id != Guid.Empty)
				{
					logger.InfoFormat("Deleting RPL.Dispatch with id {0} for ServiceOrderDispatch with id {1}", serviceOrderDispatchTask.Id, dispatch.Id);
					dispatchRplRepository.Delete(serviceOrderDispatchTask);
					logger.InfoFormat("Deleted RPL.Dispatch with id {0} for ServiceOrderDispatch with id {1}", serviceOrderDispatchTask.Id, dispatch.Id);
				}
				else
				{
					logger.DebugFormat("Updating RPL.Dispatch {0} with properties of ServiceOrderDispatch with id {1}", serviceOrderDispatchTask.Id, dispatch.Id);
					SetDispatchRplTaskProperties(serviceOrderDispatchTask, dispatch);
					dispatchRplRepository.SaveOrUpdate(serviceOrderDispatchTask);

					logger.DebugFormat("RPL.Dispatch {0} saved", serviceOrderDispatchTask.Id);
				}
			}
			catch (Exception ex)
			{
				logger.Error("An error occured on update for rpl task", ex);
			}
		}
		protected virtual void ExportTimePostings(ServiceOrderDispatch dispatch)
		{
			var itemNumbers = articleService.GetArticles().Where(x => ((ArticleExtension)x.Extensions["Sms_Einsatzplanung_Connector_Model_ArticleExtension"]).ExportToScheduler == true).Select(x => x.ItemNo).ToArray();
			var timePostingGroup = timePostingRepository.GetAll().Where(x => x.DispatchId == dispatch.Id && itemNumbers.Contains(x.Article.ItemNo)).GroupBy(x => new { x.Date, x.User.Id });
			foreach (var postingGroup in timePostingGroup)
			{
				var date = postingGroup.Key.Date;
				var user = postingGroup.Key.Id;
				var start = (postingGroup.Min(x => x.From) ?? dispatch.Time).ToLocalTime();
				var stop = start.AddMinutes((float)postingGroup.Sum(x => x.DurationInMinutes));

				var posting = CreateNewRplTimePosting(dispatch);
				posting.Dispatch = dispatch;
				posting.Start = new DateTime(date.Year, date.Month, date.Day, start.Hour, start.Minute, start.Second);
				posting.Stop = new DateTime(date.Year, date.Month, date.Day, stop.Hour, stop.Minute, stop.Second);
				posting.Person = user;
				posting.OrderKey = dispatch.OrderId;
				posting.Closed = true;

				if (timePostingRplRepository.GetAll().Any(x => x.Dispatch == posting.Dispatch && x.Start == posting.Start && x.Stop == posting.Stop && x.Person == posting.Person && x.OrderKey == posting.OrderKey))
				{
					continue;
				}

				logger.InfoFormat("Created new time posting dispatch for {0} from {1} to {2} and order {3}", posting.Person, posting.Start, posting.Stop, posting.OrderKey);
				timePostingRplRepository.SaveOrUpdate(posting);
				logger.InfoFormat("Saved time posting dispatch for {0} from {1} to {2} and order {3}", posting.Person, posting.Start, posting.Stop, posting.OrderKey);
			}
		}
		protected virtual TimeZoneInfo GetSchedulerTimeZoneInfo(RplDispatch rplServiceOrderDispatch, ServiceOrderDispatch dispatch)
		{
			return TimeZoneInfo.FindSystemTimeZoneById(appSettingsProvider.GetValue(EinsatzplanungConnectorPlugin.Settings.Export.TimeZoneId));
		}
		protected virtual DateTime GetStartTime(RplDispatch rplServiceOrderDispatch, ServiceOrderDispatch dispatch)
		{
			var timezone = GetSchedulerTimeZoneInfo(rplServiceOrderDispatch, dispatch);
			var date = TimeZoneInfo.ConvertTimeFromUtc(dispatch.Date, timezone);
			var startTime = date.Date + dispatch.Time.TimeOfDay;
			startTime = TimeZoneInfo.ConvertTimeFromUtc(startTime, timezone);
			return startTime;
		}
		protected virtual void SetDispatchRplTaskProperties(RplDispatch rplServiceOrderDispatch, ServiceOrderDispatch dispatch)
		{
			var start = GetStartTime(rplServiceOrderDispatch, dispatch);

			var firstClosedStatus = lookupManager.Get<ServiceOrderDispatchStatus>(s => s.IsClosedNotComplete());

			rplServiceOrderDispatch.Released = !dispatch.Status.IsScheduled();
			rplServiceOrderDispatch.Closed = dispatch.Status.IsClosedNotComplete() || dispatch.Status.IsClosedComplete() || dispatch.Status.IsRejected();
			rplServiceOrderDispatch.CreateDate = dispatch.CreateDate;
			rplServiceOrderDispatch.CreateUser = dispatch.CreateUser;
			rplServiceOrderDispatch.Fix = dispatch.IsFixed;
			rplServiceOrderDispatch.Dispatch = dispatch;
			rplServiceOrderDispatch.OrderKey = dispatch.OrderId;
			rplServiceOrderDispatch.Person = dispatch.DispatchedUser.Id;
			rplServiceOrderDispatch.Start = start;
			rplServiceOrderDispatch.Stop = start.AddMinutes(dispatch.DurationInMinutes);
			rplServiceOrderDispatch.TechnicianInformation = dispatch.Remark;

			if (dispatch.Status.IsRejected())
			{
				logger.InfoFormat("Dispatch was rejected from client, we will deactivate the RPL.Dispatch entry with id {0}", rplServiceOrderDispatch.Id);
				rplServiceOrderDispatch.Closed = false;
				rplServiceOrderDispatch.Released = false;
				rplServiceOrderDispatch.InternalInformation = dispatch.RejectReason.Value + " " + dispatch.RejectRemark + Environment.NewLine + rplServiceOrderDispatch.InternalInformation;
			}
		}

		public virtual void Handle(EntityDeletedEvent<ServiceOrderDispatch> e)
		{
			if (!UpdateRplTask())
			{
				return;
			}
			var dispatchId = (Guid)e.Id;
			var serviceOrderDispatchTask = dispatchRplRepository.GetAll().FirstOrDefault(x => x.Dispatch.Id == dispatchId);
			if (serviceOrderDispatchTask != null)
			{
				dispatchRplRepository.Delete(serviceOrderDispatchTask);
			}
		}

		protected virtual bool UpdateRplTask()
		{
			if (httpContextAccessor.HttpContext == null)
			{
				return true;
			}

			// Only update RPL.Task if request does not contain a header "UpdateRplTask" or the value if this header equals "true"
			var updateRplTask = httpContextAccessor.HttpContext.Request.Headers["UpdateRplTask"];

			return updateRplTask.Count == 0 || updateRplTask[0].Equals(true.ToString(CultureInfo.InvariantCulture), StringComparison.InvariantCultureIgnoreCase);
		}

		// Constructor
		public CustomerRplTaskUpdater(IRepository<RplDispatch> dispatchRplRepository, IRepositoryWithTypedId<RplTimePosting, Guid> timePostingRplRepository, IRepositoryWithTypedId<ServiceOrderTimePosting, Guid> timePostingRepository, ILookupManager lookupManager, ILog logger, IAppSettingsProvider appSettingsProvider, Func<RplTimePosting> rplTimePostingFactory, Func<RplServiceOrderDispatch> rplServiceOrderDispatchFactory, IHttpContextAccessor httpContextAccessor, IArticleService articleService)
		{
			this.dispatchRplRepository = dispatchRplRepository;
			this.timePostingRplRepository = timePostingRplRepository;
			this.timePostingRepository = timePostingRepository;
			this.lookupManager = lookupManager;
			this.logger = logger;
			this.appSettingsProvider = appSettingsProvider;
			this.rplTimePostingFactory = rplTimePostingFactory;
			this.rplServiceOrderDispatchFactory = rplServiceOrderDispatchFactory;
			this.httpContextAccessor = httpContextAccessor;
			this.articleService = articleService;
		}
	}
}

