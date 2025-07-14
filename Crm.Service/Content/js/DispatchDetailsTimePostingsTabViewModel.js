namespace("Crm.Service.ViewModels").DispatchDetailsTimePostingsTabViewModel = function(parentViewModel) {
	window.Crm.Service.ViewModels.ServiceOrderDetailsTimePostingsTabViewModel.apply(this, arguments);
	var viewModel = this;
	viewModel.dispatch = parentViewModel.dispatch;
	viewModel.validItemNosAfterCustomerSignature = window.ko.observableArray([]);
	viewModel.timePostingsCanBeAdded = window.ko.pureComputed(function() {
		return parentViewModel.dispatchIsEditable() ||
		(viewModel.dispatch().StatusKey() === "SignedByCustomer" &&
			viewModel.validItemNosAfterCustomerSignature().length > 0);
	});
	viewModel.currentJobItemGroup = ko.pureComputed(() => window.Helper.Dispatch.getCurrentJobItemGroup(viewModel));
};
namespace("Crm.Service.ViewModels").DispatchDetailsTimePostingsTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderDetailsTimePostingsTabViewModel.prototype);
namespace("Crm.Service.ViewModels").DispatchDetailsTimePostingsTabViewModel.prototype.applyFilters = function (query) {
	var viewModel = this;
	query = window.Crm.Service.ViewModels.ServiceOrderDetailsTimePostingsTabViewModel.prototype.applyFilters.call(viewModel, query);
	query = query.filter("it.DispatchId === this.dispatchId || it.DispatchId == null && it.Username == null", { dispatchId: viewModel.dispatch().Id() });
	return query;
};
namespace("Crm.Service.ViewModels").DispatchDetailsTimePostingsTabViewModel.prototype.applyOrderBy = function(query) {
	var viewModel = this;
	var id = null;
	if (viewModel.dispatch() && viewModel.dispatch().CurrentServiceOrderTimeId()) {
		id = viewModel.dispatch().CurrentServiceOrderTimeId();
	}
	query = query.orderByDescending("orderByCurrentServiceOrderTime", { currentServiceOrderTimeId: id });
	return window.Crm.Service.ViewModels.ServiceOrderDetailsTimePostingsTabViewModel.prototype.applyOrderBy.call(viewModel, query);
};
namespace("Crm.Service.ViewModels").DispatchDetailsTimePostingsTabViewModel.prototype.getItemGroup = window.Crm.Service
	.ViewModels.DispatchDetailsViewModel.prototype.getServicOrderPositionItemGroup;
namespace("Crm.Service.ViewModels").DispatchDetailsTimePostingsTabViewModel.prototype.init = function() {
	var viewModel = this;
	var args = arguments;
	return window.database.CrmArticle_Article.filter(function(it) {
			return it.ArticleTypeKey === "Service" && it.ExtensionValues.CanBeAddedAfterCustomerSignature && !it.ExtensionValues.IsHidden;
		}).map(function(it) {
			return it.ItemNo;
		}).toArray()
		.then(function(itemNos) {
			viewModel.validItemNosAfterCustomerSignature(itemNos);
			return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
		});
};
namespace("Crm.Service.ViewModels").DispatchDetailsTimePostingsTabViewModel.prototype.timePostingCanBeEdited =
	function(serviceOrderTimePosting) {
		var viewModel = this;
		return (viewModel.parentViewModel.dispatchIsEditable() ||
		(viewModel.dispatch().StatusKey() === "SignedByCustomer" &&
			viewModel.validItemNosAfterCustomerSignature().indexOf(serviceOrderTimePosting.ItemNo()) !== -1)) && !serviceOrderTimePosting.IsClosed();
	};
namespace("Crm.Service.ViewModels").DispatchDetailsTimePostingsTabViewModel.prototype.timePostingCanBeDeleted = function(serviceOrderTimePosting) {
	const editable = this.timePostingCanBeEdited.apply(this, arguments);
	if (editable && serviceOrderTimePosting.IsPrePlanned()) {
		return window.AuthorizationManager.currentUserHasPermission("ServiceOrder::TimePostingPrePlannedRemove");
	}
	return editable;
};