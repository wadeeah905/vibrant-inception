/// <reference path="../../../../Content/js/ViewModels/TaskListIndexViewModel.js" />
;
(function() {
	var getContactLink = window.Helper.Task.getContactLink;
	window.Helper.Task.getContactLink = function(task) {
		if (task.ContactType() === "Installation" && window.AuthorizationManager.isAuthorizedForAction("Installation", "Read")) {
			return "#/Crm.Service/Installation/DetailsTemplate/" + task.ContactId();
		}
		if (task.ContactType() === "ServiceOrder" && window.AuthorizationManager.isAuthorizedForAction("ServiceOrder", "Read")) {
			return "#/Crm.Service/ServiceOrder/DetailsTemplate/" + task.ContactId();
		}
		if (task.ContactType() === "ServiceCase" && window.AuthorizationManager.isAuthorizedForAction("ServiceCase", "Read")) {
			return "#/Crm.Service/ServiceCase/DetailsTemplate/" + task.ContactId();
		}
		if (task.ContactType() === "ServiceContract" && window.AuthorizationManager.isAuthorizedForAction("ServiceContract", "Read")) {
			return "#/Crm.Service/ServiceContract/DetailsTemplate/" + task.ContactId();
		}
		return getContactLink.apply(this, arguments);
	};
})();