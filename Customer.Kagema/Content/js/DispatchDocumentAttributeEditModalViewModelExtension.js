(function () {

	namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel = function (parentViewModel) {
		window.Main.ViewModels.BaseDocumentAttributeEditModalViewModel.apply(this, arguments);
		var viewModel = this;
		viewModel.dispatch = parentViewModel.dispatch;
		viewModel.serviceOrder = parentViewModel.serviceOrder;
		//viewModel.relatedDocumentsSize = ko.observable(null);
		viewModel.sendTobackOfficeDocumentsSize = ko.observable();
		viewModel.sendToCustomerDocumentsSize = ko.observable();
		viewModel.documents = window.ko.observableArray([]);
		viewModel.sizeValidationMessage = ko.observable();
		viewModel.isValidDocumentSize = ko.observable(true);

	};
	namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel.prototype =
		Object.create(window.Main.ViewModels.BaseDocumentAttributeEditModalViewModel.prototype);
	namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel.prototype.init = function (id, params) {
		var viewModel = this;
		return window.Main.ViewModels.BaseDocumentAttributeEditModalViewModel.prototype.init.apply(this, arguments).then(
			function () {
				if (!id) {
					viewModel.documentAttribute().ExtensionValues().DispatchId(ko.unwrap(viewModel.dispatch) ? viewModel.dispatch().Id() : null);
					viewModel.documentAttribute().ReferenceKey(viewModel.serviceOrder().Id());
					viewModel.documentAttribute().ExtensionValues().ServiceOrderTimeId(params.serviceOrderTimeId ||
						(ko.unwrap(viewModel.dispatch) ? viewModel.dispatch().CurrentServiceOrderTimeId() : null) ||
						null);
					viewModel.documentAttribute()
						.ReferenceType(viewModel.documentAttribute().ExtensionValues().ServiceOrderTimeId() ? 5 : 1);
				}
				viewModel.documentAttribute().ExtensionValues().ServiceOrderTimeId.subscribe(function (serviceOrderTimeId) {
					viewModel.documentAttribute().ReferenceType(serviceOrderTimeId ? 5 : 1);
				});
				viewModel.documentAttribute().innerInstance.resetChanges()
				return window.database.Main_DocumentAttribute
					.filter("it.ReferenceKey === this.orderId && it.ExtensionValues.DispatchId == this.id", { orderId: viewModel.dispatch().OrderId(), id: viewModel.dispatch().Id() })
					.toArray()
					.then(function (documents) {
						viewModel.documents(documents)
					})
					.then(function () {
						viewModel.sendTobackOfficeDocumentsSize(viewModel.documents().filter(function (x) { return x.ExtensionValues.SendToInternalSales == true })
							.reduce(function (accumulator, it) {
								return accumulator + it.Length;
							}, 0))
						viewModel.sendToCustomerDocumentsSize(viewModel.documents().filter(function (x) { return x.ExtensionValues.SendToCustomer == true })
							.reduce(function (accumulator, it) {
								return accumulator + it.Length;
							}, 0))
					})

			}).then(function () {
				viewModel.documentAttribute().ExtensionValues().SendToCustomer.subscribe(function () {
					if (viewModel.documentAttribute().ExtensionValues().SendToCustomer()) {
						viewModel.sendToCustomerDocumentsSize(viewModel.sendToCustomerDocumentsSize() + viewModel.documentAttribute().Length());
						viewModel.isValidDocumentSize(viewModel.documentSizeValidation());
					}
					else {
						viewModel.sendToCustomerDocumentsSize(viewModel.sendToCustomerDocumentsSize() - viewModel.documentAttribute().Length());
						viewModel.isValidDocumentSize(viewModel.documentSizeValidation());
					}
				});
				viewModel.documentAttribute().ExtensionValues().SendToInternalSales.subscribe(function () {
					if (viewModel.documentAttribute().ExtensionValues().SendToInternalSales()) {
						viewModel.sendTobackOfficeDocumentsSize(viewModel.sendTobackOfficeDocumentsSize() + viewModel.documentAttribute().Length());
						viewModel.isValidDocumentSize(viewModel.documentSizeValidation());
					}
					else {
						viewModel.sendTobackOfficeDocumentsSize(viewModel.sendTobackOfficeDocumentsSize() - viewModel.documentAttribute().Length());
						viewModel.isValidDocumentSize(viewModel.documentSizeValidation());
					}
				});
			})

	};





	namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel.prototype
		.getServiceOrderTimeAutocompleteDisplay = function (serviceOrderTime) {
			var viewModel = this;
			if (viewModel.dispatch && viewModel.dispatch()) {
				return window.Helper.ServiceOrderTime.getAutocompleteDisplay(serviceOrderTime, viewModel.dispatch().CurrentServiceOrderTimeId());
			}
			return window.Helper.ServiceOrderTime.getAutocompleteDisplay(serviceOrderTime, null);
		};
	namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel.prototype
		.getServiceOrderTimeAutocompleteFilter = function (query, term) {
			var viewModel = this;
			query = query.filter(function (it) {
				return it.OrderId === this.orderId;
			},
				{ orderId: viewModel.serviceOrder().Id() });
			if (term) {
				query = query.filter('it.Description.toLowerCase().contains(this.term)||it.ItemNo.toLowerCase().contains(this.term) ||it.PosNo.toLowerCase().contains(this.term)', { term: term });
			}
			return query;
		};


	namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel.prototype.save = function () {
		var viewModel = this;
		viewModel.loading(true);

		if (viewModel.errors().length > 0) {
			viewModel.loading(false);
			viewModel.errors.showAllMessages();
			return;
		}

		viewModel.documentAttribute().Description(viewModel.documentAttribute().Description() || viewModel.documentAttribute().FileResource().Filename());
		if (viewModel.documentAttribute().ExtensionValues().SendToInternalSales() || viewModel.documentAttribute().ExtensionValues().SendToCustomer()) {

		}
		if (!viewModel.documentSizeValidation()) {
			viewModel.loading(false);
			viewModel.isValidDocumentSize(viewModel.documentSizeValidation());
			//	viewModel.sizeValidationMessage(Helper.String.getTranslatedString("TheMemoryCapacityHasBeenExceeded"));
		}
		else {
			window.database.saveChanges().then(function () {
				viewModel.loading(false);
				$(".modal:visible").modal("hide");
			}).fail(function () {
				viewModel.loading(false);
				window.swal(window.Helper.String.getTranslatedString("UnknownError"),
					window.Helper.String.getTranslatedString("Error_InternalServerError"),
					"error");
			});
		}
	};


	namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel.prototype.documentSizeValidation = function () {
		var viewModel = this;
		var isValidSize = true;

		if (viewModel.documentAttribute().ExtensionValues().SendToCustomer()) {
			var totalSize = viewModel.sendToCustomerDocumentsSize() / 1048576;
			if (totalSize > 25) {
				viewModel.sizeValidationMessage(Helper.String.getTranslatedString("TheMemoryCapacityHasBeenExceeded"));
				isValidSize = false;
			}
			else {
				isValidSize = true;
			}
		}

		if (viewModel.documentAttribute().ExtensionValues().SendToInternalSales()) {
			var totalSize = viewModel.sendTobackOfficeDocumentsSize() / 1048576;
			if (totalSize > 25) {
				viewModel.sizeValidationMessage(Helper.String.getTranslatedString("TheMemoryCapacityHasBeenExceeded"));
				isValidSize = false;
			}
			else {
				isValidSize = true;
			}
		}
		return isValidSize;
	};








})();