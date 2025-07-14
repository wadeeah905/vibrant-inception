namespace("Crm.Service.ViewModels").StatisticsKeyEditModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.parentViewModel = parentViewModel;
	viewModel.originalEntity = window.ko.observable();
	viewModel.entity = window.ko.observable();
};
namespace("Crm.Service.ViewModels").StatisticsKeyEditModalViewModel.prototype.init = async function (id, params) {
	const viewModel = this;

	if (!id && !params.tableName) {
		viewModel.originalEntity = viewModel.parentViewModel.contact || viewModel.parentViewModel.entity;
	} else if (!!params.tableName) {
		let entity = await window.database[params.tableName].find(id);
		viewModel.originalEntity(entity.asKoObservable());
	} else {
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
		return Promise.reject();
	}

	viewModel.entity(window.Helper.Database.createClone(viewModel.originalEntity().innerInstance).asKoObservable());

	viewModel.entity().StatisticsKeyProductTypeKey.subscribe(function (lookup) {
		viewModel.entity().StatisticsKeyMainAssemblyKey(null);
		viewModel.entity().StatisticsKeySubAssemblyKey(null);
		viewModel.entity().StatisticsKeyAssemblyGroupKey(null);
	});
	viewModel.entity().StatisticsKeyMainAssemblyKey.subscribe(function (lookup) {
		viewModel.entity().StatisticsKeySubAssemblyKey(null);
		viewModel.entity().StatisticsKeyAssemblyGroupKey(null);
	});
	viewModel.entity().StatisticsKeySubAssemblyKey.subscribe(function (lookup) {
		viewModel.entity().StatisticsKeyAssemblyGroupKey(null);
	});

	window.database.attachOrGet(viewModel.entity().innerInstance);
	return Promise.resolve();
};

namespace("Crm.Service.ViewModels").StatisticsKeyEditModalViewModel.prototype.save = async function () {
	const viewModel = this;
	viewModel.loading(true);

	const innerInstance = viewModel.originalEntity().innerInstance;
	const editedInnerInstance = viewModel.entity().innerInstance;
	const changedProperties = (editedInnerInstance.changedProperties || []).map((x) => x.name);
	let changedExtensionProperties;
	if (editedInnerInstance.ExtensionValues) {
		changedExtensionProperties = editedInnerInstance.ExtensionValues.changedProperties;
	}
	changedExtensionProperties = (changedExtensionProperties || []).map((x) => x.name);
	window.database.attachOrGet(innerInstance);
	window.Helper.Database.transferData(changedProperties, editedInnerInstance, innerInstance);
	window.Helper.Database.transferData(changedExtensionProperties, editedInnerInstance.ExtensionValues, innerInstance.ExtensionValues);

	await window.database.saveChanges().fail(function () {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
	});

	viewModel.loading(false);
	$(".modal:visible").modal("hide");
}

namespace("Crm.Service.ViewModels").StatisticsKeyEditModalViewModel.prototype.onSelectStatisticsKey = function (entity) {
	const viewModel = this;
	if (!entity)
		return;
	const lookupName = window.Helper.StatisticsKey.getJsNameByTable(entity.getType().name);
	let lookups = viewModel.parentViewModel.lookups[lookupName]();
	lookups[entity.Key] = entity;
	viewModel.parentViewModel.lookups[lookupName](lookups);
};

namespace("Crm.Service.ViewModels").StatisticsKeyEditModalViewModel.prototype.detach = function () {
	const viewModel = this;
	window.database.detach(viewModel.entity().innerInstance);
}
