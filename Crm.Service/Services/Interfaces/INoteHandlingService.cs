namespace Crm.Service.Services.Interfaces
{
	using System;

	using Crm.Library.AutoFac;

	public interface INoteHandlingService : IDependency
	{
		void AddNoteAfterAddingDeletingDoc(string fileName, Guid referenceKey, int referenceType, string userName, string localePrefix);
	}
}