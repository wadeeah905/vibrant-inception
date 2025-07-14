(function () {
	window.Crm.Service.ViewModels.ServiceOrderMaterialEditModalViewModel.prototype.onArticleSelect =
		function (article) {
			var viewModel = this;
			if (article) {
				if (!viewModel.serviceOrderMaterial().Article() || JSON.stringify(viewModel.serviceOrderMaterial().Article().innerInstance) != JSON.stringify(article)) {
					viewModel.serviceOrderMaterial().Article(article.asKoObservable());
				}
				viewModel.serviceOrderMaterial().ArticleId(article.Id);
				viewModel.serviceOrderMaterial().ArticleTypeKey(article.ArticleTypeKey);
				viewModel.serviceOrderMaterial().IsSerial(article.IsSerial);
				if (viewModel.serviceOrderMaterial().Description() == null || viewModel.serviceOrderMaterial().Description() == "") {
		    viewModel.serviceOrderMaterial().Description(window.Helper.Article.getArticleDescription(article))} ;
				viewModel.serviceOrderMaterial().ItemNo(article.ItemNo);
				if ((viewModel.serviceOrderMaterial().Article().ItemNo() !== window.Customer.Kagema.Settings.dummyArticleItemNo) || (viewModel.serviceOrderMaterial().Article().ItemNo() == window.Customer.Kagema.Settings.dummyArticleItemNo && viewModel.serviceOrderMaterial().innerInstance.entityState !== 30)) { viewModel.serviceOrderMaterial().Price(article.Price || 0); }
				viewModel.serviceOrderMaterial().QuantityUnitKey(article.QuantityUnitKey);
				viewModel.articleIsWarehouseManaged(article.IsWarehouseManaged);
				viewModel.updateReplenishmentOrder(!!viewModel.serviceOrderMaterial().ReplenishmentOrderItemId() && viewModel.articleIsWarehouseManaged());
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
				viewModel.updateReplenishmentOrder(false);
			}
			if (!!viewModel.serviceOrderMaterial().ReplenishmentOrderItemId() && !viewModel.articleIsWarehouseManaged()) {
				viewModel.showNonWmWarning(true);
			} else {
				viewModel.showNonWmWarning(false);
			}
			viewModel.updateServiceOrderMaterialSerials();
		};
	namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.init = function (id, params) {
		var viewModel = this;
		if (params.articleType) {
			viewModel.articleType(params.articleType);
		}
		if (params.currentServiceOrderTimeId) {
			viewModel.currentServiceOrderTimeId(params.currentServiceOrderTimeId);
		}
		return window.Helper.User.getCurrentUser().then(function (user) {
			viewModel.currentUser(user);
		}).then(function () {
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
			newServiceOrderMaterial.FromLocation = viewModel.currentUser().ExtensionValues.DefaultLocationNo;
			newServiceOrderMaterial.FromWarehouse = viewModel.currentUser().ExtensionValues.DefaultStoreNo;
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
	 		viewModel.serviceOrderMaterial().ExternalRemark.extend({
				validation: {
validator: function (val) {
	if(ko.validation.utils.isEmptyVal(val)) { return true; }
if (viewModel.serviceOrderMaterial().Article().ItemNo() !== window.Customer.Kagema.Settings.dummyArticleItemNo) { return true; } 
	var normalizedVal = ko.validation.utils.isNumber(val) ? ('' + val) : val;
	var normalizedVal2 = ko.validation.utils.isNumber(viewModel.serviceOrderMaterial().InternalRemark()) ? ('' + viewModel.serviceOrderMaterial().InternalRemark()) : viewModel.serviceOrderMaterial().InternalRemark();
	return normalizedVal.length +normalizedVal2.length <= 50;
},
		message: window.Helper.String.getTranslatedString("RuleViolation.MaxLength").replace("{0}", window.Helper.String.getTranslatedString("Value")),
		

			
				
				}
			});
	    viewModel.serviceOrderMaterial().InternalRemark.extend({
				validation: {
validator: function (val) {
	if(ko.validation.utils.isEmptyVal(val)) { return true; }
						if (viewModel.serviceOrderMaterial().Article().ItemNo() !== window.Customer.Kagema.Settings.dummyArticleItemNo) { return true; } 
	var normalizedVal = ko.validation.utils.isNumber(val) ? ('' + val) : val;
	var normalizedVal2 = ko.validation.utils.isNumber(viewModel.serviceOrderMaterial().ExternalRemark()) ? ('' + viewModel.serviceOrderMaterial().ExternalRemark()) : viewModel.serviceOrderMaterial().ExternalRemark();
	return normalizedVal.length +normalizedVal2.length <= 50;
},
		message: window.Helper.String.getTranslatedString("RuleViolation.MaxLength").replace("{0}", window.Helper.String.getTranslatedString("Value")),
		

			
				
				}
			});

			if (viewModel.serviceOrderMaterial().innerInstance.entityState == '20' && viewModel.articleType() == 'Cost') {
				return window.database.CrmArticle_Article
					.filter("it.ItemNo == this.dummyArticleItemNo", { dummyArticleItemNo: window.Customer.Kagema.Settings.dummyArticleItemNo })
					.first()
					.then(function (article) {
						if (article) {
							viewModel.serviceOrderMaterial().ArticleId(article.Id)
							viewModel.serviceOrderMaterial().ActualQty(1)
						}
					})
			}
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
					onlyIf: function () {
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
					onlyIf: function () {
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
					onlyIf: function () {
						return viewModel.serviceOrderMaterial().Article() && viewModel.canEditInvoiceQty();
					}
				}
			});

	
			viewModel.serviceOrderMaterial().ActualQty.subscribe(function () {
				viewModel.updateServiceOrderMaterialSerials();
			});
			viewModel.showSerials.subscribe(function (value) {
				if (value === true) {
					viewModel.updateServiceOrderMaterialSerials();
				}
			});
			viewModel.updateServiceOrderMaterialSerials();
			viewModel.serviceOrderMaterial().ServiceOrderMaterialSerials().forEach(function (serviceOrderMaterialSerial) {
				viewModel.subscribeToServiceOrderMaterialSerial(serviceOrderMaterialSerial);
				if (serviceOrderMaterialSerial.NoPreviousSerialNoReasonKey()) {
					viewModel.showReasons.push({ serialId: serviceOrderMaterialSerial.Id(), showReason: ko.observable(true) });
				}
				else { viewModel.showReasons.push({ serialId: serviceOrderMaterialSerial.Id(), showReason: ko.observable(false) }) }
			});
			viewModel.updateReplenishmentOrder(!!viewModel.serviceOrderMaterial().ReplenishmentOrderItemId() && viewModel.articleIsWarehouseManaged());
		}).then(async function () {
			if (viewModel.serviceOrderMaterial().FromWarehouse()) {
				var store = await window.database.CrmService_Store.filter("it.StoreNo == this.storeNo", { storeNo: viewModel.serviceOrderMaterial().FromWarehouse() }).first();
				viewModel.selectedStore(store.Id);
			}
			if (viewModel.serviceOrderMaterial().FromLocation()) {
				var location = await window.database.CrmService_Location.filter("it.LocationNo == this.locationNo", { locationNo: viewModel.serviceOrderMaterial().FromLocation() }).first();
				viewModel.selectedLocation(location.Id);
			}
		}).then(function () {
			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
		}).then(function () {
			return window.Helper.ServiceOrder.canEditActualQuantities(viewModel.serviceOrderMaterial().OrderId());
		}).then(function (result) {
			viewModel.canEditActualQty(result);
			return window.Helper.ServiceOrder.canEditEstimatedQuantities(viewModel.serviceOrderMaterial().OrderId());
		}).then(function (result) {
			viewModel.canEditEstimatedQty(result);
			return window.Helper.ServiceOrder.canEditInvoiceQuantities(viewModel.serviceOrderMaterial().OrderId());
		}).then(function (result) {
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
	namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.save = function () {
		var viewModel = this;
		viewModel.loading(true);

		if (!viewModel.validateSerials()) {
			viewModel.serviceOrderMaterial().ServiceOrderMaterialSerials().forEach(function (serviceOrderMaterialSerial) {
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

		if (viewModel.serviceOrderMaterial().innerInstance.entityState == 20) {
			viewModel.serviceOrderMaterial().ExtensionValues().Calculate(true);
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



namespace("Crm.Service.ViewModels").ServiceOrderMaterialEditModalViewModel.prototype.getArticleSelect2Filter =
		function (query, filter) {
			var viewModel = this;
			if (viewModel.serviceOrderMaterial().innerInstance.entityState == 20) {
				var language = document.getElementById("meta.CurrentLanguage").content;
				query = query.filter(function (item) {
					return item.ExtensionValues.ShelfNo.startsWith('M') || item.ExtensionValues.ShelfNo.startsWith('H') || item.ExtensionValues.ShelfNo.startsWith('E') || item.ExtensionValues.ShelfNo.startsWith('V') || item.ExtensionValues.ShelfNo.startsWith('m') || item.ExtensionValues.ShelfNo.startsWith('h') || item.ExtensionValues.ShelfNo.startsWith('e') || item.ExtensionValues.ShelfNo.startsWith('v');
				});
				return window.Helper.Article.getArticleAutocompleteFilter(query, filter, language);
			}
			else {
				return window.Helper.Article.getArticleAutocompleteFilter(query, filter, language);
			}
 
		};

})();

