/// <reference path="../../../../Content/js/ViewModels/TaskListIndexViewModel.js" />
;
(function() {
	var getContactLink = window.Helper.Task.getContactLink;
	window.Helper.Task.getContactLink = function(task) {
		if (task.ContactType() === "Visit" && window.AuthorizationManager.isAuthorizedForAction("Visit", "Read")) {
			return "#/Crm.VisitReport/Visit/DetailsTemplate/" + task.ContactId();
		}
		return getContactLink.apply(this, arguments);
	};
})();