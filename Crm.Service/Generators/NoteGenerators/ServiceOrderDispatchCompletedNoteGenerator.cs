namespace Crm.Service.Generators.NoteGenerators
{
	using System;

	using Crm.Generators.NoteGenerators.Infrastructure;
	using Crm.Infrastructure;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Globalization.Resource;
	using Crm.Model;
	using Crm.Model.Notes;
	using Crm.Service.Events;
	using Crm.Service.Model;
	using Crm.Service.Model.Notes;

	using LMobile.Unicore;

	using Microsoft.AspNetCore.Routing;

	public class ServiceOrderDispatchCompletedNoteGenerator : NoteGenerator<ServiceOrderDispatchCompletedEvent>
	{
		private readonly Func<ServiceOrderDispatchCompletedNote> noteFactory;
		private readonly Func<LinkResource> linkFactory;
		private readonly IResourceManager resourceManager;
		private readonly IAbsolutePathHelper absolutePathHelper;
		public ServiceOrderDispatchCompletedNoteGenerator(IRepositoryWithTypedId<Note, Guid> noteRepository, Func<ServiceOrderDispatchCompletedNote> noteFactory, Func<LinkResource> linkFactory, IResourceManager resourceManager, IAbsolutePathHelper absolutePathHelper)
			: base(noteRepository)
		{
			this.noteFactory = noteFactory;
			this.linkFactory = linkFactory;
			this.resourceManager = resourceManager;
			this.absolutePathHelper = absolutePathHelper;
		}
		public override Note GenerateNote(ServiceOrderDispatchCompletedEvent e)
		{
			var note = noteFactory();
			note.IsActive = true;
			note.ContactId = e.ServiceOrderDispatch.OrderId;
			note.AuthData = e.ServiceOrderDispatch.AuthData != null ? new EntityAuthData { DomainId = e.ServiceOrderDispatch.AuthData.DomainId } : null;
			note.Text = e.ServiceOrderDispatch.StatusKey;
			note.Meta = string.Join(";", e.ServiceOrderDispatch.DispatchedUsername);
			note.Plugin = ServicePlugin.PluginName;
			note.Links.Add(GetDispatchReportLink(e.ServiceOrderDispatch));
			return note;
		}
		public virtual LinkResource GetDispatchReportLink(ServiceOrderDispatch serviceOrderDispatch)
		{
			var dispatchReportLink = linkFactory();
			dispatchReportLink.Description = resourceManager.GetTranslation("DispatchReport");
			dispatchReportLink.Url = absolutePathHelper.GetPath("GetReport", "Dispatch", new RouteValueDictionary { { "plugin", ServicePlugin.PluginName }, { "dispatchId", serviceOrderDispatch.Id }, { "orderNo", serviceOrderDispatch.OrderHead.OrderNo } });
			return dispatchReportLink;
		}
	}
}