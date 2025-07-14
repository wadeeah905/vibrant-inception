namespace("Crm.Service.ViewModels").InstallationPositionEditModalViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.lookups = {
		quantityUnits: { $tableName: "CrmArticle_QuantityUnit" },
		articleTypes: { $tableName: "CrmArticle_ArticleType" }
	};
	viewModel.installationPosition = window.ko.observable(null);
	viewModel.quantityUnit = window.ko.pureComputed(function() {
		return viewModel.lookups.quantityUnits.$array.find(function(x) {
			return x.Key === viewModel.installationPosition().QuantityUnitKey();
		});
	});
	viewModel.selectedArticle = window.ko.observable();
	viewModel.errors = window.ko.validation.group(viewModel.installationPosition, { deep: true });
};
namespace("Crm.Service.ViewModels").InstallationPositionEditModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	return new $.Deferred().resolve().promise().then(function() {
		if (id) {
			return window.database.CrmService_InstallationPos
				.find(id)
				.then(function(installationPosition) {
					window.database.attachOrGet(installationPosition);
					return installationPosition;
				});
		}
		var newInstallationPosition = window.database.CrmService_InstallationPos.CrmService_InstallationPos.create();
		newInstallationPosition.ActualQty = 1;
		newInstallationPosition.Quantity = 1;
		newInstallationPosition.InstallationId = params.installationId;
		newInstallationPosition.IsInstalled = true;
		window.database.add(newInstallationPosition);
		return newInstallationPosition;
	}).then(function(installationPosition) {
		viewModel.installationPosition(installationPosition.asKoObservable());
	}).then(function() {
		if (!!params.referenceId) {
			viewModel.installationPosition().ReferenceId(params.referenceId);
		}
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	});
};
namespace("Crm.Service.ViewModels").InstallationPositionEditModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.installationPosition().innerInstance);
};
namespace("Crm.Service.ViewModels").InstallationPositionEditModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}
	window.Helper.Installation.updatePosNo(viewModel.installationPosition())
		.then(function() {
			return window.database.saveChanges();
		}).then(function() {
			viewModel.loading(false);
			$(".modal:visible").modal("hide");
		}).fail(function() {
			viewModel.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"),
				window.Helper.String.getTranslatedString("Error_InternalServerError"),
				"error");
		});
};
namespace("Crm.Service.ViewModels").InstallationPositionEditModalViewModel.prototype.getArticleSelect2Filter =
	function (query, filter) {
		var language = document.getElementById("meta.CurrentLanguage").content;
		query = query.filter(function(it) { return it.ArticleTypeKey in ["Material", "Cost", "Service","Tool"]; });
		return window.Helper.Article.getArticleAutocompleteFilter(query, filter, language);
	};
namespace("Crm.Service.ViewModels").InstallationPositionEditModalViewModel.prototype.installationPosFilter =
	function(query, term) {
		var viewModel = this;
		if (term) {
			query = query.filter(function(it) {
				return it.ItemNo.toLowerCase().contains(this.term) || it.Description.toLowerCase().contains(this.term);
			}, { term: term });
		}
		return query.filter(function(it) {
				return it.InstallationId === this.installationId &&
					it.IsGroupItem === true &&
					it.Id !== this.installationPositionId;
			},
			{
				installationId: viewModel.installationPosition().InstallationId(),
				installationPositionId: viewModel.installationPosition().Id()
			});
	};
namespace("Crm.Service.ViewModels").InstallationPositionEditModalViewModel.prototype.onArticleSelect =
	function(article) {
		var viewModel = this;
		viewModel.selectedArticle(article);
		if (article) {
			viewModel.installationPosition().IsSerial(article.IsSerial);
			if (article.IsSerial) {
				viewModel.installationPosition().Quantity(1);
			} else {
				viewModel.installationPosition().SerialNo(null);
			}
			viewModel.installationPosition().Description(window.Helper.Article.getArticleDescription(article));
			viewModel.installationPosition().ItemNo(article.ItemNo);
			viewModel.installationPosition().QuantityUnitKey(article.QuantityUnitKey);
		} else {
			viewModel.installationPosition().Description(null);
			viewModel.installationPosition().ItemNo(null);
			viewModel.installationPosition().QuantityUnitKey(null);
		}
	};
namespace("Crm.Service.ViewModels").InstallationPositionEditModalViewModel.prototype.mapArticleForSelect2Display =
	function(article) {
		let viewModel = this;
		return {
			id: article.Id,
			item: article.asKoObservable(),
			text: window.Helper.Article.getArticleAutocompleteDisplay(article) + " (" + Helper.Lookup.getLookupValue(viewModel.lookups.articleTypes, article.ArticleTypeKey) + ")"
		};
	};
namespace("Crm.Service.ViewModels").InstallationPositionEditModalViewModel.prototype.relatedInstallationFilter = function(query, term) {
	var viewModel = this;
	if (term) {
		query = query.filter(function(it) {
			return it.InstallationNo.toLowerCase().contains(this.term) || it.Description.toLowerCase().contains(this.term);
		}, { term: term });
	}
	return query.filter(function(it) {
		return it.Id !== this.installationId
	},
		{
			installationId: viewModel.installationPosition().InstallationId()
		});
};
namespace("Crm.Service.ViewModels").InstallationPositionEditModalViewModel.prototype.onRelatedInstallationSelected = function(installation) {
	var viewModel = this;
	if (!!installation) {
		viewModel.installationPosition().IsGroupItem(false);
	}
};