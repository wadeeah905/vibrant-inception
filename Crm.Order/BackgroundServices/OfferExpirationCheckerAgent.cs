namespace Crm.Order.BackgroundServices
{
	using System;
	using System.Linq;

	using Crm.Library.BackgroundServices;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Data.NHibernateProvider;
	using Crm.Order.Model;
	using Crm.Order.Model.Lookups;

	using log4net;

	using Microsoft.Extensions.Hosting;

	using Quartz;

	
	[DisallowConcurrentExecution]
	public class OfferExpirationCheckerAgent : JobBase
	{
		private readonly IRepository<Offer> offerRepository;

		protected override void Run(IJobExecutionContext context)
		{
			CheckHasExpired();
		}

		protected virtual void CheckHasExpired()
		{
			var today = DateTime.UtcNow.Date;
			var offers = offerRepository.GetAll().Where(x => x.SendConfirmation && x.ValidTo.HasValue && x.StatusKey == OrderStatus.OpenKey && x.ValidTo.Value < today);
			foreach (var offer in offers)
			{
				offer.StatusKey = OrderStatus.ExpiredKey;
				offerRepository.SaveOrUpdate(offer);
			}
		}

		public OfferExpirationCheckerAgent(ISessionProvider sessionProvider, IRepository<Offer> offerRepository, ILog logger, IHostApplicationLifetime hostApplicationLifetime)
			: base(sessionProvider, logger, hostApplicationLifetime)
		{
			this.offerRepository = offerRepository;
		}
	}
}
