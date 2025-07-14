namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	
	viewModel.showActiveArticles = window.ko.observable(true);
	viewModel.showExpiredArticles = window.ko.observable(false);
	viewModel.showAllArticles = window.ko.pureComputed({
		read: function () {
			return viewModel.showActiveArticles() && viewModel.showExpiredArticles();
		},
		write: function (value) {
			viewModel.showActiveArticles(value);
			viewModel.showExpiredArticles(value);
		},
		owner: viewModel
	});
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	viewModel.dispatch = parentViewModel && parentViewModel.dispatch || window.ko.observable(null);
	viewModel.articleAutocomplete = window.ko.observable("");
	viewModel.articleType = window.ko.observable("Material");
	viewModel.articleIsWarehouseManaged = window.ko.observable(false);
	viewModel.canEditActualQty = window.ko.observable(false);
	viewModel.canEditEstimatedQty = window.ko.observable(false);
	viewModel.canEditInvoiceQty = window.ko.observable(false);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.currentServiceOrderTimeId = window.ko.observable(null);
	viewModel.documentAttribute = window.ko.observable(null);
	viewModel.fileResource = window.ko.observable(null);
	viewModel.initialQuantity = window.ko.observable(0);
	viewModel.storeQuantity = window.ko.observable(0);
	viewModel.locationQuantity = window.ko.observable(0);
	viewModel.selectedStore = window.ko.observable(null);
	viewModel.selectedLocation = window.ko.observable(null);
	viewModel.showNonWmWarning = ko.observable(false);
	viewModel.showReasons = window.ko.observableArray([]);
	viewModel.showDispatchSelection = window.ko.observable(false);
	viewModel.lookups = {
		quantityUnits: { $tableName: "CrmArticle_QuantityUnit" },
		currencies: { $tableName: "Main_Currency" },
		installationHeadStatuses: { $tableName: "CrmService_InstallationHeadStatus" },
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" }
	};
	viewModel.updateReplenishmentOrder = window.ko.observable(false);
	viewModel.serviceOrderMaterial = window.ko.observable(null);

	viewModel.quantityUnit = window.ko.pureComputed(function() {
		return viewModel.lookups.quantityUnits.$array.find(function(x) {
			return x.Key === viewModel.serviceOrderMaterial().QuantityUnitKey();
		});
	});
	viewModel.showSerials = window.ko.pureComputed(function() {
		return viewModel.serviceOrderMaterial().IsSerial();
	});
	viewModel.validateSerials = window.ko.pureComputed(function() {
		return viewModel.serviceOrderMaterial().IsSerial();
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.toggleDiscountType = function() {
	var viewModel = this;
	if (viewModel.serviceOrderMaterial().DiscountType() === window.Crm.Article.Model.Enums.DiscountType.Percentage) {
		viewModel.serviceOrderMaterial().DiscountType(window.Crm.Article.Model.Enums.DiscountType.Absolute);
	} else {
		viewModel.serviceOrderMaterial().DiscountType(window.Crm.Article.Model.Enums.DiscountType.Percentage);
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	if (params.articleType) {
		viewModel.articleType(params.articleType);
	}
	if (params.currentServiceOrderTimeId) {
		viewModel.currentServiceOrderTimeId(params.currentServiceOrderTimeId);
	}
		return window.Helper.User.getCurrentUser().then(function (user) {
			viewModel.currentUser(user);
		}).then(function(){
			if (id) {
				return window.database.CrmService_ServiceOrderMaterial
					.include("Article")
					.include("DocumentAttributes")
					.include("DocumentAttributes.FileResource")
					.include("ReplenishmentOrderItem")
					.include("ServiceOrderHead")
					.include("ServiceOrderMaterialSerials")
					.find(id)
					.then(function (serviceOrderMaterial) {
						serviceOrderMaterial.DispatchId = params.dispatchId || serviceOrderMaterial.DispatchId;
						window.database.attachOrGet(serviceOrderMaterial);
						serviceOrderMaterial.ServiceOrderMaterialSerials.forEach(function (serviceOrderMaterialSerial) {
							window.database.attachOrGet(serviceOrderMaterialSerial);
						});
						viewModel.initialQuantity(serviceOrderMaterial.ActualQty);
						if (serviceOrderMaterial.Article) {
							viewModel.articleType(serviceOrderMaterial.Article.ArticleTypeKey);
							viewModel.articleIsWarehouseManaged(serviceOrderMaterial.Article.IsWarehouseManaged);
						}
						return serviceOrderMaterial;
					});
			}
			var newServiceOrderMaterial =
				window.database.CrmService_ServiceOrderMaterial.CrmService_ServiceOrderMaterial.create();
			newServiceOrderMaterial.DispatchId = params.dispatchId || null;
			if (viewModel.articleType() && viewModel.articleType() === "Material") {
				newServiceOrderMaterial.FromLocation = viewModel.currentUser().ExtensionValues.DefaultLocationNo;
				newServiceOrderMaterial.FromWarehouse = viewModel.currentUser().ExtensionValues.DefaultStoreNo;
			}
			newServiceOrderMaterial.OrderId = params.serviceOrderId;
			newServiceOrderMaterial.ServiceOrderTimeId =
				params.serviceOrderTimeId || params.currentServiceOrderTimeId || null;
			window.database.add(newServiceOrderMaterial);
			return newServiceOrderMaterial;
		}).then(function (serviceOrderMaterial) {
		if (serviceOrderMaterial.DocumentAttributes.length === 0) {
			var newFileResource = window.database.Main_FileResource.Main_FileResource.create();
			window.database.add(newFileResource);
			viewModel.fileResource(newFileResource.asKoObservable());
			var newDocumentAttribute = window.database.Main_DocumentAttribute.Main_DocumentAttribute.create();
			newDocumentAttribute.DocumentCategoryKey = "Document";
			newDocumentAttribute.ExtensionValues.DispatchId = serviceOrderMaterial.DispatchId;
			newDocumentAttribute.FileResource = newFileResource;
			newDocumentAttribute.FileResourceKey = viewModel.fileResource().Id();
			newDocumentAttribute.ReferenceKey = serviceOrderMaterial.OrderId;
			newDocumentAttribute.DiscountType = Crm.Article.Model.Enums.DiscountType.Absolute;
			newDocumentAttribute.ExtensionValues.ServiceOrderMaterialId = serviceOrderMaterial.Id;
			newDocumentAttribute.ReferenceType = 4;
			window.database.add(newDocumentAttribute);
			viewModel.documentAttribute(newDocumentAttribute.asKoObservable());
		} else {
			var documentAttribute = serviceOrderMaterial.DocumentAttributes[0];
			viewModel.documentAttribute(documentAttribute.asKoObservable());
			window.database.attachOrGet(documentAttribute);
			viewModel.fileResource(documentAttribute.FileResource.asKoObservable());
			window.database.attachOrGet(documentAttribute.FileResource);
		}
		viewModel.fileResource().Filename.subscribe(viewModel.documentAttribute().Description);
		viewModel.fileResource().Filename.subscribe(viewModel.documentAttribute().FileName);
		viewModel.fileResource().Id.subscribe(viewModel.documentAttribute().FileResourceKey);
		viewModel.fileResource().Length.subscribe(viewModel.documentAttribute().Length);
		viewModel.serviceOrderMaterial(serviceOrderMaterial.asKoObservable());
		viewModel.serviceOrderMaterial().ActualQty.extend({
			validation: {
				validator: function (val) {
					return viewModel.serviceOrderMaterial().EstimatedQty() > 0 || viewModel.serviceOrderMaterial().InvoiceQty() > 0 || val > 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("Quantity")),
				onlyIf: function () {
					return viewModel.canEditActualQty();
				}
			}
		});
		viewModel.serviceOrderMaterial().ActualQty.extend({
			validation: {
				validator: viewModel.quantityValidator.bind(viewModel.serviceOrderMaterial().Article),
				message: () => window.Helper.String.getTranslatedString("RuleViolation.RespectQuantityStep")
					.replace("{0}", window.Helper.String.getTranslatedString("Quantity"))
					.replace("{1}", viewModel.serviceOrderMaterial().Article()?.QuantityStep()),
				onlyIf: function() {
					return viewModel.serviceOrderMaterial().Article();
				}
			}
		});
		viewModel.serviceOrderMaterial().EstimatedQty.extend({
			validation: {
				validator: function (val) {
					return viewModel.serviceOrderMaterial().ActualQty() > 0 || viewModel.serviceOrderMaterial().InvoiceQty() > 0 || val > 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("EstimatedQty")),
				onlyIf: function () {
					return viewModel.canEditEstimatedQty();
				}
			}
		});
		viewModel.serviceOrderMaterial().EstimatedQty.extend({
			validation: {
				validator: viewModel.quantityValidator.bind(viewModel.serviceOrderMaterial().Article),
				message: () => window.Helper.String.getTranslatedString("RuleViolation.RespectQuantityStep")
					.replace("{0}", window.Helper.String.getTranslatedString("EstimatedQty"))
					.replace("{1}", viewModel.serviceOrderMaterial().Article()?.QuantityStep()),
				onlyIf: function() {
					return viewModel.serviceOrderMaterial().Article() && viewModel.canEditEstimatedQty();
				}
			}
		});
		viewModel.serviceOrderMaterial().InvoiceQty.extend({
			validation: {
				validator: function (val) {
					return viewModel.serviceOrderMaterial().ActualQty() > 0 || viewModel.serviceOrderMaterial().EstimatedQty() > 0 || val > 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("InvoiceQty")),
				onlyIf: function () {
					return viewModel.canEditInvoiceQty();
				}
			}
		});
		viewModel.serviceOrderMaterial().InvoiceQty.extend({
			validation: {
				validator: viewModel.quantityValidator.bind(viewModel.serviceOrderMaterial().Article),
				message: () => window.Helper.String.getTranslatedString("RuleViolation.RespectQuantityStep")
					.replace("{0}", window.Helper.String.getTranslatedString("InvoiceQty"))
					.replace("{1}", viewModel.serviceOrderMaterial().Article()?.QuantityStep()),
				onlyIf: function() {
					return viewModel.serviceOrderMaterial().Article() && viewModel.canEditInvoiceQty();
				}
			}
		});
		viewModel.serviceOrderMaterial().ActualQty.subscribe(function() {
			viewModel.updateServiceOrderMaterialSerials();
		});
		viewModel.showSerials.subscribe(function (value) {
			if (value === true) {
				viewModel.updateServiceOrderMaterialSerials();
			}
		});
		viewModel.updateServiceOrderMaterialSerials();
		viewModel.serviceOrderMaterial().ServiceOrderMaterialSerials().forEach(function(serviceOrderMaterialSerial) {
			viewModel.subscribeToServiceOrderMaterialSerial(serviceOrderMaterialSerial);
			if (serviceOrderMaterialSerial.NoPreviousSerialNoReasonKey()) {
				viewModel.showReasons.push({ serialId: serviceOrderMaterialSerial.Id(), showReason: ko.observable(true) });
			}
      else { viewModel.showReasons.push({ serialId: serviceOrderMaterialSerial.Id(), showReason: ko.observable(false) }) }
		});
		viewModel.updateReplenishmentOrder(!!viewModel.serviceOrderMaterial().ReplenishmentOrderItemId() && viewModel.articleIsWarehouseManaged());
	}).then(async function() {
		if (viewModel.serviceOrderMaterial().FromWarehouse()) {
			var store = await window.database.CrmService_Store.filter("it.StoreNo == this.storeNo", { storeNo: viewModel.serviceOrderMaterial().FromWarehouse() }).first();
			viewModel.selectedStore(store.Id);
		}
		if (viewModel.serviceOrderMaterial().FromLocation()) {
			var location = await window.database.CrmService_Location.filter("it.LocationNo == this.locationNo", { locationNo: viewModel.serviceOrderMaterial().FromLocation() }).first();
			viewModel.selectedLocation(location.Id);
		}
	}).then(function() {
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function() {
		return window.Helper.ServiceOrder.canEditActualQuantities(viewModel.serviceOrderMaterial().OrderId());
	}).then(function(result) {
		viewModel.canEditActualQty(result);
		return window.Helper.ServiceOrder.canEditEstimatedQuantities(viewModel.serviceOrderMaterial().OrderId());
	}).then(function(result) {
		viewModel.canEditEstimatedQty(result);
		return window.Helper.ServiceOrder.canEditInvoiceQuantities(viewModel.serviceOrderMaterial().OrderId());
	}).then(function(result) {
		viewModel.canEditInvoiceQty(result);
		if (!id && viewModel.canEditInvoiceQty()) {
			viewModel.serviceOrderMaterial().InvoiceQty(1);
		} else if (!id && viewModel.canEditActualQty()) {
			viewModel.serviceOrderMaterial().ActualQty(1);
		} else if (!id && viewModel.canEditEstimatedQty()) {
			viewModel.serviceOrderMaterial().EstimatedQty(1);
		}
		viewModel.serviceOrderMaterial().innerInstance.resetChanges();
		viewModel.errors = window.ko.validation.group(viewModel.serviceOrderMaterial, { deep: viewModel.articleType() === "Cost" ? false : true });
		viewModel.showDispatchSelection(!params.dispatchId); //shows when opened from service order
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.quantityValidator = function (value) {
	var article = this;
	var qtyStep = article().QuantityStep();
	if (qtyStep === 0) {
		return true; //"any"
	}
	var decimalLength = Math.max(Helper.Number.countDecimals(qtyStep), Helper.Number.countDecimals(value));
	var stepCount = (value / qtyStep).toFixed(decimalLength);
	return parseInt(stepCount) == stepCount;
}
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	viewModel.serviceOrderMaterial().ServiceOrderMaterialSerials().forEach(function(serviceOrderMaterialSerial) {
		window.database.detach(serviceOrderMaterialSerial.innerInstance);
	});
	window.database.detach(viewModel.documentAttribute().innerInstance);
	window.database.detach(viewModel.fileResource().innerInstance);
	window.database.detach(viewModel.serviceOrderMaterial().innerInstance);
};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);

	if (!viewModel.validateSerials()) {
		viewModel.serviceOrderMaterial().ServiceOrderMaterialSerials().forEach(function(serviceOrderMaterialSerial) {
			if (!serviceOrderMaterialSerial.SerialNo()) {
				if (serviceOrderMaterialSerial.innerInstance.entityState === $data.EntityState.Added) {
					window.database.detach(serviceOrderMaterialSerial.innerInstance);
				} else {
					window.database.remove(serviceOrderMaterialSerial.innerInstance);
				}
				viewModel.serviceOrderMaterial().ServiceOrderMaterialSerials.splice(viewModel.serviceOrderMaterial()
					.ServiceOrderMaterialSerials.indexOf(serviceOrderMaterialSerial),
					1);
			}
		});
	}

	if (!viewModel.fileResource().Content()) {
		if (viewModel.documentAttribute().innerInstance.entityState === $data.EntityState.Added) {
			window.database.detach(viewModel.documentAttribute().innerInstance);
		} else if (viewModel.documentAttribute().innerInstance.entityState !== $data.EntityState.Detached) {
			window.database.remove(viewModel.documentAttribute().innerInstance);
		}
		if (viewModel.fileResource().innerInstance.entityState === $data.EntityState.Added) {
			window.database.detach(viewModel.fileResource().innerInstance);
		} else if (viewModel.fileResource().innerInstance.entityState !== $data.EntityState.Detached) {
			window.database.remove(viewModel.fileResource().innerInstance);
		}
	}

	if (viewModel.errors().length > 0) {
		viewModel.updateServiceOrderMaterialSerials();
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}
	if (window.Crm.Service.Settings.PosNoGenerationMethod == "MixedMaterialAndTimes") {
		window.Helper.ServiceOrder.updatePosNo(viewModel.serviceOrderMaterial())
			.then(function () {
				return viewModel.saveReplenishmentOrderItem();
			}).then(function () {
				return window.database.saveChanges();
			}).then(function () {
				viewModel.loading(false);
				$(".modal:visible").modal("hide");
			}).fail(function () {
				viewModel.loading(false);
				window.swal(window.Helper.String.getTranslatedString("UnknownError"),
					window.Helper.String.getTranslatedString("Error_InternalServerError"),
					"error");
			});
	} else {
		window.Helper.ServiceOrder.updateMaterialPosNo(viewModel.serviceOrderMaterial())
			.then(function () {
				return viewModel.saveReplenishmentOrderItem();
			}).then(function () {
				return window.database.saveChanges();
			}).then(function () {
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
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.saveReplenishmentOrderItem =
	function() {
		var viewModel = this;
		var serviceOrderMaterial = viewModel.serviceOrderMaterial();
		if (!viewModel.articleIsWarehouseManaged()) {
			if (!!serviceOrderMaterial.ReplenishmentOrderItemId()) {
				return window.database.CrmService_ReplenishmentOrderItem
					.find(serviceOrderMaterial.ReplenishmentOrderItemId())
					.then(function (replenishmentorderitem) {
						serviceOrderMaterial.ReplenishmentOrderItemId(null);
						window.database.remove(replenishmentorderitem);
					})
			}
		}
		if (!viewModel.updateReplenishmentOrder()) {
			return new $.Deferred().resolve().promise();
		}
		return window.Helper.ReplenishmentOrder.getOrCreateCurrentReplenishmentOrder(viewModel.currentUser().Id)
			.then(function(replenishmentOrder) {
				var createNewReplenishmentOrderItem = !serviceOrderMaterial.ReplenishmentOrderItem() ||
					serviceOrderMaterial.ReplenishmentOrderItem().ReplenishmentOrderId() !== replenishmentOrder.Id();
				if (createNewReplenishmentOrderItem) {
					var newReplenishmentOrderItem = window.database.CrmService_ReplenishmentOrderItem
						.CrmService_ReplenishmentOrderItem.create();
					newReplenishmentOrderItem.ReplenishmentOrderId = replenishmentOrder.Id();
					window.database.add(newReplenishmentOrderItem);
					serviceOrderMaterial.ReplenishmentOrderItem(newReplenishmentOrderItem.asKoObservable());
					serviceOrderMaterial.ReplenishmentOrderItemId(newReplenishmentOrderItem.Id);
				} else {
					window.database.attachOrGet(serviceOrderMaterial.ReplenishmentOrderItem());
					if (serviceOrderMaterial.ReplenishmentOrderItem().ArticleId() == serviceOrderMaterial.ArticleId()
						&& serviceOrderMaterial.ReplenishmentOrderItem().Quantity() == serviceOrderMaterial.ActualQty()) {
						return new $.Deferred().resolve().promise();
					}
				}
				if (serviceOrderMaterial.ActualQty() === 0) {
					serviceOrderMaterial.ReplenishmentOrderItemId(null);
					window.database.remove(serviceOrderMaterial.ReplenishmentOrderItem());
					return new $.Deferred().resolve().promise();
				}
				serviceOrderMaterial.ReplenishmentOrderItem().ArticleId(serviceOrderMaterial.ArticleId());
				serviceOrderMaterial.ReplenishmentOrderItem().MaterialNo(serviceOrderMaterial.ItemNo());
				serviceOrderMaterial.ReplenishmentOrderItem().Description(serviceOrderMaterial.Description());
				serviceOrderMaterial.ReplenishmentOrderItem()
					.Quantity(serviceOrderMaterial.ActualQty());
				serviceOrderMaterial.ReplenishmentOrderItem().QuantityUnitKey(serviceOrderMaterial.QuantityUnitKey());
			});
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.showFileSelection =
	function() {
		var viewModel = this;
		return viewModel.articleType() === "Cost";
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.getArticleSelect2Filter =
	function(query,term) {
		var viewModel = this;
		query = query.filter(function(it) {
				return it.ArticleTypeKey === this.articleType && it.ExtensionValues.IsHidden === false;
			},
			{ articleType: viewModel.articleType() });
		if (viewModel.dispatch() && viewModel.dispatch().StatusKey() === "SignedByCustomer") {
			query = query.filter(function(it) {
				return it.ExtensionValues.CanBeAddedAfterCustomerSignature;
			});
		}
		return window.Helper.Article.getArticleAutocompleteFilter(query, term, viewModel.currentUser().DefaultLanguageKey);
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype
	.getServiceOrderTimeAutocompleteDisplay = function(serviceOrderTime) {
		var viewModel = this;
		return window.Helper.ServiceOrderTime.getAutocompleteDisplay(serviceOrderTime,
			viewModel.currentServiceOrderTimeId());
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.getServiceOrderTimeAutocompleteFilter = function(query,term) {
		var viewModel = this;
		query = query.filter(function(it) {
				return it.OrderId === this.orderId;
			},
			{ orderId: viewModel.serviceOrderMaterial().OrderId() });
	if (term) {
		query = query.filter('it.Description.toLowerCase().contains(this.term)||it.ItemNo.toLowerCase().contains(this.term) ||it.PosNo.toLowerCase().contains(this.term)', { term: term });
		}
		return query;
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.onArticleSelect =
	function(article) {
		var viewModel = this;
		if (article) {
			if ((!viewModel.serviceOrderMaterial().Article() || JSON.stringify(viewModel.serviceOrderMaterial().Article().innerInstance) != JSON.stringify(article)) && (!viewModel.serviceOrderMaterial().Article() || viewModel.serviceOrderMaterial().Article().Id() !== article.Id)) {
				viewModel.serviceOrderMaterial().Article(article.asKoObservable());
				viewModel.serviceOrderMaterial().ArticleId(article.Id);
				viewModel.serviceOrderMaterial().ArticleTypeKey(article.ArticleTypeKey);
				viewModel.serviceOrderMaterial().IsSerial(article.IsSerial);
				viewModel.serviceOrderMaterial().Description(window.Helper.Article.getArticleDescription(article));
				viewModel.serviceOrderMaterial().ItemNo(article.ItemNo);
				viewModel.serviceOrderMaterial().Price(article.Price || 0);
				viewModel.serviceOrderMaterial().QuantityUnitKey(article.QuantityUnitKey);
				viewModel.articleIsWarehouseManaged(article.IsWarehouseManaged);
				viewModel.updateReplenishmentOrder(!!viewModel.serviceOrderMaterial().ReplenishmentOrderItemId() && viewModel.articleIsWarehouseManaged());
				viewModel.serviceOrderMaterial().IsBatch(article.IsBatch);
				if (!article.IsBatch) {
					viewModel.serviceOrderMaterial().BatchNo(null);
				}
			}
		} else {
			viewModel.serviceOrderMaterial().Article(null);
			viewModel.serviceOrderMaterial().ArticleId(null);
			viewModel.serviceOrderMaterial().ArticleTypeKey(null);
			viewModel.serviceOrderMaterial().IsSerial(false);
			viewModel.serviceOrderMaterial().Description(null);
			viewModel.serviceOrderMaterial().ItemNo(null);
			viewModel.serviceOrderMaterial().Price(null);
			viewModel.serviceOrderMaterial().QuantityUnitKey(null);
			viewModel.articleIsWarehouseManaged(false);
			viewModel.serviceOrderMaterial().IsBatch(false);
			viewModel.updateReplenishmentOrder(false);
			viewModel.serviceOrderMaterial().BatchNo(null);
		}
		if (!!viewModel.serviceOrderMaterial().ReplenishmentOrderItemId() && !viewModel.articleIsWarehouseManaged()) {
			viewModel.showNonWmWarning(true);
		} else {
			viewModel.showNonWmWarning(false);
		}
		viewModel.updateServiceOrderMaterialSerials();
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype
	.subscribeToServiceOrderMaterialSerial =
	function(serviceOrderMaterialSerial) {
		serviceOrderMaterialSerial.NoPreviousSerialNoReasonKey.subscribe(function(value) {
			if (value) {
				serviceOrderMaterialSerial.PreviousSerialNo(null);
			}
		});
		serviceOrderMaterialSerial.PreviousSerialNo.subscribe(function(value) {
			if (value) {
				serviceOrderMaterialSerial.NoPreviousSerialNoReasonKey(null);
			}
		});
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.updateServiceOrderMaterialSerials =
	function() {
		var viewModel = this;
		var serviceOrderMaterial = viewModel.serviceOrderMaterial();
		var serviceOrderMaterialSerials = serviceOrderMaterial.ServiceOrderMaterialSerials;
		while (viewModel.showSerials() && serviceOrderMaterialSerials().length < serviceOrderMaterial.ActualQty()) {
			var newServiceOrderMaterialSerial = window.database.CrmService_ServiceOrderMaterialSerial
				.CrmService_ServiceOrderMaterialSerial.create().asKoObservable();
			newServiceOrderMaterialSerial.OrderMaterialId(serviceOrderMaterial.Id());
			window.database.add(newServiceOrderMaterialSerial.innerInstance);
			viewModel.showReasons.push({ serialId: newServiceOrderMaterialSerial.Id(), showReason: ko.observable(false) });
			serviceOrderMaterialSerials.push(newServiceOrderMaterialSerial);
			viewModel.subscribeToServiceOrderMaterialSerial(newServiceOrderMaterialSerial);
		}
		while (serviceOrderMaterialSerials().length > 0 &&
			(!viewModel.showSerials() || serviceOrderMaterialSerials().length > serviceOrderMaterial.ActualQty())) {
			var emptyServiceOrderMaterialSerial = window.ko.utils.arrayFirst(serviceOrderMaterialSerials(),
				function(serviceOrderMaterialSerial) {
					return serviceOrderMaterialSerial.SerialNo() === null ||
						serviceOrderMaterialSerial.SerialNo() === "";
				});
			var indexToRemove = emptyServiceOrderMaterialSerial
				? serviceOrderMaterialSerials().indexOf(emptyServiceOrderMaterialSerial)
				: serviceOrderMaterialSerials().length - 1;
			var serviceOrderMaterialSerialToRemove = serviceOrderMaterialSerials()[indexToRemove];
			if (serviceOrderMaterialSerialToRemove.innerInstance.entityState === $data.EntityState.Added) {
				window.database.detach(serviceOrderMaterialSerialToRemove.innerInstance);
			} else {
				window.database.remove(serviceOrderMaterialSerialToRemove.innerInstance);
			}
			serviceOrderMaterialSerials.splice(indexToRemove, 1);
			viewModel.showReasons().splice(indexToRemove, 1);
		}
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.locationFilter =
	function (query, term) {
		var viewModel = this;
		query = query.filter('it.StoreId == this.storeId', { storeId: viewModel.selectedStore() });
		if (term) {
			query = query.filter('it.LocationNo.contains(this.term)', { term: term });
		}
		return query;
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.onStoreSelect = function(store) {
	const viewModel = this;
	let d = $.Deferred().resolve(0).promise();
	if (store) {
		viewModel.loading(true);
		d = window.database.CrmService_Location.filter("StoreId", "===", store.Id).count();
	}
	return d.then(function(count) {
		viewModel.locationQuantity(count);
	}).then(function() {
		if (store == null || store.Locations.length == 0 || store.StoreNo != viewModel.serviceOrderMaterial().FromWarehouse()) {
			viewModel.serviceOrderMaterial().FromLocation(null);
			viewModel.selectedLocation(null);
		} else if (store.Locations.length == 1) {
			viewModel.serviceOrderMaterial().FromLocation(store.Locations[0].LocationNo);
			viewModel.selectedLocation(store.Locations[0].Id);
		}
		viewModel.serviceOrderMaterial().FromWarehouse(store != null ? store.StoreNo : null);
		viewModel.loading(false);
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.onLocationSelect =
	function (location) {
		var viewModel = this;

		if (location != null) {
			viewModel.serviceOrderMaterial().FromLocation(location.LocationNo);
		}
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.updateShowReasonForSerial =
	function (serviceOrderMaterialSerial) {
		var viewModel = this;
		var indexToUpdate = viewModel.showReasons().indexOf(window.ko.utils.arrayFirst(viewModel.showReasons(), (function (x) { return x.serialId === serviceOrderMaterialSerial.Id() })));
		viewModel.showReasons()[indexToUpdate].showReason(!viewModel.showReasons()[indexToUpdate].showReason());
	};
namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.isJobEditable = function() {
	return (!this.serviceOrderMaterial().EstimatedQty() || window.AuthorizationManager.currentUserHasPermission("ServiceOrder::EditMaterialPrePlannedJob"))
}