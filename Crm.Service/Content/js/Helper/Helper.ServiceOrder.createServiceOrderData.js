/// <reference path="../../../../../Content/js/system/async-1.4.2.js" />
/// <reference path="Helper.Service.js" />

class HelperCreateServiceOrderData {
	constructor(serviceOrder, serviceOrderTemplate, installationIds) {
		this.serviceOrder = Helper.Database.getDatabaseEntity(serviceOrder);
		this.serviceOrderTemplate = Helper.Database.getDatabaseEntity(serviceOrderTemplate);

		this.invoicingTypes = {};
		this.installationIds = installationIds;
		this.serviceOrderData = [];
	}

	create() {
		return Helper.Lookup.getLocalizedArrayMap("Main_InvoicingType").then(invoicingTypes => {
			this.invoicingTypes = invoicingTypes;
			return (this.serviceOrderTemplate ? this.createTemplateData() : this.createJobs());
		}).then(() => {
			return this.setPositionNumbers();
		});
	}

	createDocumentAttributeFromTemplate(documentAttributeTemplate, materialId = null, serviceOrderTimeId = null) {
		const documentAttribute = window.database.Main_DocumentAttribute
			.Main_DocumentAttribute.create();
		documentAttribute.Description = documentAttributeTemplate.Description;
		documentAttribute.DocumentCategoryKey = documentAttributeTemplate.DocumentCategoryKey;
		documentAttribute.ExtensionValues = documentAttributeTemplate.ExtensionValues;
		if (materialId != null) {
			documentAttribute.ExtensionValues.ServiceOrderMaterialId = materialId;
		}
		if (serviceOrderTimeId != null) {
			documentAttribute.ExtensionValues.ServiceOrderTimeId = serviceOrderTimeId;
		}
		documentAttribute.FileName = documentAttributeTemplate.FileName;
		documentAttribute.FileResourceKey = documentAttributeTemplate.FileResourceKey;
		documentAttribute.Length = documentAttributeTemplate.Length;
		documentAttribute.LongText = documentAttributeTemplate.LongText;
		documentAttribute.OfflineRelevant = documentAttributeTemplate.OfflineRelevant;
		documentAttribute.ReferenceKey = this.serviceOrder.Id;
		documentAttribute.ReferenceType = documentAttributeTemplate.ReferenceType;
		documentAttribute.UseForThumbnail = documentAttributeTemplate.ReferenceType;
		window.database.add(documentAttribute);
		this.serviceOrderData.push(documentAttribute);
		return documentAttribute;
	}

	createJobs() {
		const serviceOrderTimes = [];
		if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation") {
			this.installationIds.forEach((installationId) => {
				const serviceOrderTime = window.database.CrmService_ServiceOrderTime.CrmService_ServiceOrderTime.create();
				serviceOrderTime.InstallationId = installationId;
				serviceOrderTime.OrderId = this.serviceOrder.Id;
				serviceOrderTime.InvoicingTypeKey = this.serviceOrder.InvoicingTypeKey;
				Helper.Service.onInvoicingTypeSelected(serviceOrderTime, this.invoicingTypes[serviceOrderTime.InvoicingTypeKey]);
				window.database.add(serviceOrderTime);
				this.serviceOrderData.push(serviceOrderTime);
				serviceOrderTimes.push(serviceOrderTime);
			});
		}
		return new $.Deferred().resolve(serviceOrderTimes).promise();
	}

	createServiceOrderMaterialFromTemplate(serviceOrderMaterialTemplate) {
		const serviceOrderMaterial = window.database.CrmService_ServiceOrderMaterial.CrmService_ServiceOrderMaterial.create();
		serviceOrderMaterial.ArticleId = serviceOrderMaterialTemplate.ArticleId;
		serviceOrderMaterial.Description = serviceOrderMaterialTemplate.Description;
		serviceOrderMaterial.EstimatedQty = serviceOrderMaterialTemplate.EstimatedQty;
		serviceOrderMaterial.ExtensionValues = serviceOrderMaterialTemplate.ExtensionValues;
		serviceOrderMaterial.ExternalRemark = serviceOrderMaterialTemplate.ExternalRemark;
		serviceOrderMaterial.InternalRemark = serviceOrderMaterialTemplate.InternalRemark;
		serviceOrderMaterial.IsSerial = serviceOrderMaterialTemplate.IsSerial;
		serviceOrderMaterial.ItemDescription = serviceOrderMaterialTemplate.ItemDescription;
		serviceOrderMaterial.ItemNo = serviceOrderMaterialTemplate.ItemNo;
		serviceOrderMaterial.OrderId = this.serviceOrder.Id;
		serviceOrderMaterial.Price = serviceOrderMaterialTemplate.Price;
		serviceOrderMaterial.QuantityUnitKey = serviceOrderMaterialTemplate.QuantityUnitKey;
		window.database.add(serviceOrderMaterial);
		this.serviceOrderData.push(serviceOrderMaterial);
		return window.database.Main_DocumentAttribute.filter(function (it) {
				return it.ExtensionValues.ServiceOrderMaterialId === this.Id;
			},
			{Id: serviceOrderMaterialTemplate.Id})
			.toArray()
			.then((documentAttributeTemplates) => {
				documentAttributeTemplates.forEach((documentAttributeTemplate) => {
					this.createDocumentAttributeFromTemplate(documentAttributeTemplate, serviceOrderMaterial.Id);
				});
				return serviceOrderMaterial;
			});
	}

	createServiceOrderTimePostingFromTemplate(serviceOrderTimePostingTemplate) {
		const serviceOrderTimePosting = window.database.CrmService_ServiceOrderTimePosting.defaultType.create();
		serviceOrderTimePosting.ArticleId = serviceOrderTimePostingTemplate.ArticleId;
		serviceOrderTimePosting.Date = serviceOrderTimePostingTemplate.Date;
		serviceOrderTimePosting.Description = serviceOrderTimePostingTemplate.Description;
		serviceOrderTimePosting.ExtensionValues = serviceOrderTimePostingTemplate.ExtensionValues;
		serviceOrderTimePosting.InternalRemark = serviceOrderTimePostingTemplate.InternalRemark;
		serviceOrderTimePosting.ItemNo = serviceOrderTimePostingTemplate.ItemNo;
		serviceOrderTimePosting.OrderId = this.serviceOrder.Id;
		serviceOrderTimePosting.PlannedDuration = serviceOrderTimePostingTemplate.PlannedDuration;
		window.database.add(serviceOrderTimePosting);
		this.serviceOrderData.push(serviceOrderTimePosting);
		return serviceOrderTimePosting;
	}

	createServiceOrderTimeFromTemplate(serviceOrderTimeTemplate) {
		const createServiceOrderData = this;
		serviceOrderTimeTemplate = Helper.Database.getDatabaseEntity(serviceOrderTimeTemplate);
		const serviceOrderTime = window.database.CrmService_ServiceOrderTime.CrmService_ServiceOrderTime.create();
		serviceOrderTime.ArticleId = serviceOrderTimeTemplate.ArticleId;
		serviceOrderTime.Comment = serviceOrderTimeTemplate.Comment;
		serviceOrderTime.Description = serviceOrderTimeTemplate.Description;
		serviceOrderTime.EstimatedDuration = serviceOrderTimeTemplate.EstimatedDuration;
		serviceOrderTime.ExtensionValues = serviceOrderTimeTemplate.ExtensionValues;
		serviceOrderTime.InvoicingTypeKey = serviceOrderTimeTemplate.InvoicingTypeKey;
		Helper.Service.onInvoicingTypeSelected(serviceOrderTime, this.invoicingTypes[serviceOrderTime.InvoicingTypeKey]);
		serviceOrderTime.ItemNo = serviceOrderTimeTemplate.ItemNo;
		serviceOrderTime.OrderId = this.serviceOrder.Id;
		window.database.add(serviceOrderTime);
		this.serviceOrderData.push(serviceOrderTime);
		return window.database.CrmService_ServiceOrderMaterial
			.filter("ServiceOrderTimeId", "===", serviceOrderTimeTemplate.Id)
			.toArray()
			.then((serviceOrderMaterialTemplates) => {
				let d = $.Deferred();
				Promise.all(serviceOrderMaterialTemplates.map(serviceOrderMaterialTemplate => this.createServiceOrderMaterialFromTemplate(serviceOrderMaterialTemplate))).then(serviceOrderMaterials => {
					serviceOrderMaterials.forEach(serviceOrderMaterial => {
						serviceOrderMaterial.ServiceOrderTimeId = serviceOrderTime.Id;
					});
					d.resolve();
				})
				return d.promise();
			}).then(() =>{
				return window.database.CrmService_ServiceOrderTimePosting
					.filter("ServiceOrderTimeId", "===", serviceOrderTimeTemplate.Id)
					.toArray();
			}).then((serviceOrderTimePostingTemplates) => {
				for (const template of serviceOrderTimePostingTemplates) {
					const timePosting = this.createServiceOrderTimePostingFromTemplate(template);
					timePosting.ServiceOrderTimeId = serviceOrderTime.Id;
				}
				return serviceOrderTime;
				}).then((serviceOrderTime) => {
					return window.database.Main_DocumentAttribute.filter(function(it) {
							return it.ReferenceKey === this.serviceOrderTemplateId && it.ExtensionValues.ServiceOrderTimeId === this.serviceOrderTimeId;
						},
						{ serviceOrderTemplateId: serviceOrderTimeTemplate.OrderId, serviceOrderTimeId: serviceOrderTimeTemplate.Id })
						.toArray()
						.then(function(documentAttributeTemplates) {
							documentAttributeTemplates.forEach(function(documentAttributeTemplate) {
								if (!documentAttributeTemplate.ExtensionValues.ServiceOrderMaterialId)
									createServiceOrderData.createDocumentAttributeFromTemplate(documentAttributeTemplate, null, serviceOrderTime.Id);
							});
							return serviceOrderTime;
						});
			});
	}

	createTemplateData() {
		Helper.Service.onInvoicingTypeSelected(this.serviceOrder, this.invoicingTypes[this.serviceOrder.InvoicingTypeKey]);
		return window.database.CrmService_ServiceOrderTime.filter(function (it) {
				return it.OrderId === this.serviceOrderTemplateId;
			},
			{serviceOrderTemplateId: this.serviceOrderTemplate.Id})
			.orderBy("it.PosNo")
			.toArray()
			.then((serviceOrderTimeTemplates) => {
				if (serviceOrderTimeTemplates.length === 0) {
					return this.createJobs();
				} else {
					const d = new $.Deferred();
					const serviceOrderTimes = [];
					async.eachSeries(serviceOrderTimeTemplates,
						(serviceOrderTimeTemplate, cb) => {
							if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode ===
								"OrderPerInstallation") {
								this.createServiceOrderTimeFromTemplate(serviceOrderTimeTemplate).then(
									function (serviceOrderTime) {
										serviceOrderTimes.push(serviceOrderTime);
										cb();
									}).fail(cb);
							} else {
								if (this.installationIds.length === 0) {
									this.createServiceOrderTimeFromTemplate(serviceOrderTimeTemplate).then(
										function (serviceOrderTime) {
											serviceOrderTimes.push(serviceOrderTime);
										});
								}
								async.eachSeries(this.installationIds,
									(installationId, cb2) => {
										this.createServiceOrderTimeFromTemplate(serviceOrderTimeTemplate).then(
											function (serviceOrderTime) {
												serviceOrderTime.InstallationId = installationId;
												serviceOrderTimes.push(serviceOrderTime);
												cb2();
											}).fail(cb2);
									},
									cb);
							}
						},
						function (e) {
							if (e) {
								d.reject(e);
							} else {
								d.resolve(serviceOrderTimes);
							}
						});
					return d.promise();
				}
			}).then((result) => {
				return window.database.CrmService_ServiceOrderMaterial.filter(function (it) {
						return it.OrderId === this.serviceOrderTemplateId && it.ServiceOrderTimeId === null;
					},
					{serviceOrderTemplateId: this.serviceOrderTemplate.Id})
					.toArray()
					.then((serviceOrderMaterialTemplates) => {
						let d = $.Deferred();
						Promise.all(serviceOrderMaterialTemplates.map(serviceOrderMaterialTemplate => this.createServiceOrderMaterialFromTemplate(serviceOrderMaterialTemplate))).then(serviceOrderMaterials => {
							d.resolve(result);
						})
						return d.promise();
					});
			}).then((result) => {
				return window.database.CrmService_ServiceOrderTimePosting
					.filter("OrderId", "===", this.serviceOrderTemplate.Id)
					.filter("ServiceOrderTimeId", "===", null)
					.forEach((template) => this.createServiceOrderTimePostingFromTemplate(template))
					.then(() => result);
			}).then((result) => {
				return window.database.Main_DocumentAttribute.filter(function (it) {
						return it.ReferenceKey === this.serviceOrderTemplateId && it.ExtensionValues.ServiceOrderTimeId === null && it.ExtensionValues.ServiceOrderMaterialId === null;
					},
					{serviceOrderTemplateId: this.serviceOrderTemplate.Id})
					.toArray()
					.then((documentAttributeTemplates) => {
						documentAttributeTemplates.forEach((documentAttributeTemplate) => {
							if (!documentAttributeTemplate.ExtensionValues.ServiceOrderMaterialId)
								this.createDocumentAttributeFromTemplate(documentAttributeTemplate);
						});
						return result;
					});
			});
	}

	setPositionNumbers() {
		let posNo = 0;
		this.serviceOrderData.filter(function (x) {
			return x instanceof window.database.CrmService_ServiceOrderTime.CrmService_ServiceOrderTime;
		}).forEach(function (x) {
			x.PosNo = window.Helper.ServiceOrder.formatPosNo(++posNo);
		});
		this.serviceOrderData.filter(function (x) {
			return x instanceof window.database.CrmService_ServiceOrderMaterial.CrmService_ServiceOrderMaterial;
		}).forEach(function (x) {
			x.PosNo = window.Helper.ServiceOrder.formatPosNo(++posNo);
		});
	}
}

(window.Helper.ServiceOrder = window.Helper.ServiceOrder || {}).CreateServiceOrderData = HelperCreateServiceOrderData;