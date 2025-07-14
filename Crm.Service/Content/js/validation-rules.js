/// <reference path="../../../../Content/js/knockout.custom.material.js" />
/// <reference path="../../../../Content/js/knockout.custom.validation.js" />
;
(function(ko, moment) {
	ko.validationRules.add("CrmService_InstallationPos", function (entity) {
		entity.Quantity.extend({
			validation:
			[
				{
					rule: "required",
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Quantity")),
					params: true
				},
				{
					rule: "min",
					params: 1,
					message: window.Helper.String.getTranslatedString("RuleViolation.Greater").replace("{0}", window.Helper.String.getTranslatedString("Quantity")).replace("{1}", "0")
				}
			]
		});
		entity.RemoveDate.extend({
			validation:
			{
				message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
					.replace("{0}", window.Helper.String.getTranslatedString("InstallDate"))
					.replace("{1}", window.Helper.String.getTranslatedString("RemoveDate")),
				onlyIf: function () {
					return !!entity.InstallDate();
				},
				validator: function (val) {
					return !window.moment(entity.InstallDate()).isAfter(val);
				}
			}
		});
		entity.WarrantyEndSupplier.extend({
			validation:
			{
				message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
					.replace("{0}", window.Helper.String.getTranslatedString("WarrantyStartSupplier"))
					.replace("{1}", window.Helper.String.getTranslatedString("WarrantyEndSupplier")),
				onlyIf: function () {
					return !!entity.WarrantyStartSupplier();
				},
				validator: function (val) {
					return !window.moment(entity.WarrantyStartSupplier()).isAfter(val);
				}
			}
		});
		entity.WarrantyEndCustomer.extend({
			validation:
			{
				message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
					.replace("{0}", window.Helper.String.getTranslatedString("WarrantyStartCustomer"))
					.replace("{1}", window.Helper.String.getTranslatedString("WarrantyEndCustomer")),
				onlyIf: function () {
					return !!entity.WarrantyStartCustomer();
				},
				validator: function (val) {
					return !window.moment(entity.WarrantyStartCustomer()).isAfter(val);
				}
			}
		});
		entity.SerialNo.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("T_SerialNr")),
					onlyIf: function(val) {
						return entity.IsSerial();
					}
				}
		});
		entity.ArticleId.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("Material")),
				onlyIf: function() {
					return entity.ItemNo() == null || entity.ItemNo().length === 0;
				}
			}
		});
	});
	ko.validationRules.add("CrmService_Installation",
		function (entity) {
				entity.InstallationNo.extend({
					unique: {
						params: [window.database.CrmService_Installation, 'InstallationNo', entity.Id],
						onlyIf: function () {
							return entity.innerInstance.entityState === $data.EntityState.Added;
						},
						message: Helper.String.getTranslatedString("RuleViolation.Unique")
							.replace("{0}", Helper.String.getTranslatedString("InstallationNo"))
					}
				});
				entity.ManufactureDate.extend({
				validation: [
					{
						message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
							.replace("{0}", window.Helper.String.getTranslatedString("ManufactureDate"))
							.replace("{1}", window.Helper.String.getTranslatedString("KickoffDate")),
						onlyIf: function() {
							return !!entity.KickOffDate();
						},
						validator: function(val) {
							return !window.moment(val).isAfter(entity.KickOffDate());
						}
					},
					{
						message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
							.replace("{0}", window.Helper.String.getTranslatedString("ManufactureDate")).replace("{1}",
								window.Helper.String.getTranslatedString("WarrantyFrom")),
						onlyIf: function() {
							return !!entity.WarrantyFrom();
						},
						validator: function(val) {
							return !window.moment(val).isAfter(entity.WarrantyFrom());
						}
					},
					{
						message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
							.replace("{0}", window.Helper.String.getTranslatedString("ManufactureDate")).replace("{1}",
								window.Helper.String.getTranslatedString("WarrantyUntil")),
						onlyIf: function() {
							return !!entity.WarrantyUntil();
						},
						validator: function(val) {
							return !window.moment(val).isAfter(entity.WarrantyUntil());
						}
					}
				]
			});
			entity.WarrantyFrom.extend({
				validation:
				{
					message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
						.replace("{0}", window.Helper.String.getTranslatedString("WarrantyFrom"))
						.replace("{1}", window.Helper.String.getTranslatedString("WarrantyUntil")),
					onlyIf: function() {
						return !!entity.WarrantyUntil();
					},
					validator: function(val) {
						return !window.moment(val).isAfter(entity.WarrantyUntil());
					}
				}

			});
		});
	ko.validationRules.add("CrmService_ReplenishmentOrderItem", function (entity) {
		entity.ArticleId.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Material"))
			}
		});
		entity.Quantity.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("Quantity")),
			}
		});
		entity.Quantity.extend({
			validation: {
				validator: function (val) {
					return val > 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", Helper.String.getTranslatedString("Quantity")),
			}
		});
	});
	ko.validationRules.add("CrmService_ServiceOrderDispatch", function(entity) {
			entity.DispatchedUser.extend({
				required: false,
				maxLength: {
					onlyIf: () => false
				}
			});
			entity.Duration.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Duration"))
				}
			});
			entity.SignatureContactName.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required")
						.replace("{0}", window.Helper.String.getTranslatedString("SignatureContactName")),
					onlyIf: function() {
						return !!entity.SignatureJson();
					}
				}
			});
			entity.SignatureJson.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("MissingCustomerSignature"),
					onlyIf: function() {
						return window.Crm.Service.Settings.Service.Dispatch.Requires.CustomerSignature && ["ClosedNotComplete", "ClosedComplete"].indexOf(entity.StatusKey()) !== -1;
					}
				}
			});
			entity.SignPrivacyPolicyAccepted.extend({
				validation: {
					validator: function(val) {
						return val === true;
					},
					message: window.Helper.String.getTranslatedString("PleaseAcceptDataPrivacyPolicy"),
					onlyIf: function() {
						return window.Crm.Service.Settings.Service.Dispatch.Show.PrivacyPolicy && !!entity.SignatureJson();
					}
				}
			});
			entity.SignatureOriginatorName.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required")
						.replace("{0}", window.Helper.String.getTranslatedString("SignatureOriginatorName")),
					onlyIf: function() {
						return !!entity.SignatureOriginatorJson();
					}
				}
			});
			entity.StatusKey.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Status"))
				}
			});
			entity.RejectReasonKey.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("RejectReason")),
					onlyIf: function() {
						return entity.StatusKey() === "Rejected";
					}
				}
			});
			entity.Username.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required")
						.replace("{0}", window.Helper.String.getTranslatedString("Technician"))
				}
			});
			entity.DispatchNo.extend({
				unique: {
					params: [window.database.CrmService_ServiceOrderDispatch, 'DispatchNo', entity.Id],
					onlyIf: function () {
						return entity.innerInstance.entityState === $data.EntityState.Added;
					},
					message: Helper.String.getTranslatedString("RuleViolation.Unique")
						.replace("{0}", Helper.String.getTranslatedString("DispatchNo"))
				}
			});
			if (!!entity.ServiceOrder() && !!entity.ServiceOrder().Installation()) {
				ko.validation.addRule(entity.ServiceOrder().Installation().StatusKey,
					{
						rule: "required",
						message: Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("InstallationStatus")),
						params: true
					});
			}
	});
	ko.validationRules.add("CrmService_ServiceOrderHead", function(entity) {
			entity.CustomerContactId.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Customer")),
					onlyIf: function() {
						return !entity.IsTemplate();
					}
				}
			});
		entity.OrderNo.extend({
			unique: {
				params: [window.database.CrmService_ServiceOrderHead, 'OrderNo', entity.Id],
				message: Helper.String.getTranslatedString("RuleViolation.Unique")
					.replace("{0}", Helper.String.getTranslatedString("OrderNo"))
			},
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("OrderNo")),
				onlyIf: function() {
					return !window.Crm.Service.Settings.ServiceOrder.OrderNoIsGenerated && !entity.IsTemplate();
				}
			}
		});
			entity.ErrorMessage.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("ErrorMessage")),
					onlyIf: function () {
						return !entity.IsTemplate();
					}
				}
			});
			entity.Reported.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Reported")),
					onlyIf: function () {
						return !entity.IsTemplate();
					}
				}
			});
			entity.StatusKey.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Status"))
				}
			});
			entity.TypeKey.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("ServiceOrderType"))
				}
			});
		});
	ko.validationRules.add("CrmService_ServiceOrderMaterialSerial",
		function(entity) {
			entity.PreviousSerialNo.extend({
				requiresOneOf: {
					params: [entity.PreviousSerialNo, entity.NoPreviousSerialNoReasonKey],
					message: window.Helper.String.getTranslatedString("RuleViolation.PreviousSerialNoRequired")
				}
			});
			entity.NoPreviousSerialNoReasonKey.extend({
				requiresOneOf: {
					params: [entity.PreviousSerialNo, entity.NoPreviousSerialNoReasonKey],
					message: window.Helper.String.getTranslatedString("RuleViolation.PreviousSerialNoRequired")
				}
			});
		});
	ko.validationRules.add("CrmService_ServiceOrderMaterial",
		function (entity) {
			entity.ActualQty.extend({
				validation: {
					validator: function (val) {
						return val >= 0;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
						.replace("{0}", Helper.String.getTranslatedString("Quantity"))
				}
			});
			entity.ActualQty.extend({
				validation: {
					validator: function (val) {
						return val < 10000000000000000;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.MaxValue").replace("{0}", window.Helper.String.getTranslatedString("Quantity"))
				}
			});
			entity.EstimatedQty.extend({
				validation: {
					validator: function (val) {
						return val >= 0;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
						.replace("{0}", Helper.String.getTranslatedString("EstimatedQty")),
				}
			});
			entity.EstimatedQty.extend({
				validation: {
					validator: function (val) {
						return val < 10000000000000000;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.MaxValue").replace("{0}", window.Helper.String.getTranslatedString("EstimatedQty"))
				}
			});
			entity.InvoiceQty.extend({
				validation: {
					validator: function (val) {
						return val >= 0;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
						.replace("{0}", Helper.String.getTranslatedString("InvoiceQty")),
				}
			});
			entity.InvoiceQty.extend({
				validation: {
					validator: function (val) {
						return val < 10000000000000000;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.MaxValue").replace("{0}", window.Helper.String.getTranslatedString("InvoiceQty"))
				}
			});
			entity.ArticleId.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("Material")),
					onlyIf: function() {
						return entity.ItemNo() == null || entity.ItemNo().length === 0;
					}
				}
			});
			entity.Discount.extend({
				validation: {
					validator: function (val) {
						return val >= 0;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
						.replace("{0}", Helper.String.getTranslatedString("Discount")),
				}
			});
			entity.Discount.extend({
				validation: {
					validator: function (val) {
						return entity.DiscountType() === window.Crm.Article.Model.Enums.DiscountType.Percentage ? val <= 100 : val <= entity.Price();
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.DiscountBiggerThanPrice")
				}
			});
		});
	ko.validationRules.add("CrmService_ServiceOrderTimePosting",
		function(entity) {
		entity.ArticleId.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Article"))
			}
		});
		entity.Date.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Date"))
			}
		});
		entity.Duration.extend({
			validation: {
				validator: function (val) {
					if (!entity.Username() && entity.PlannedDuration() && !val) {
						return true;
					}
					return val && window.moment.duration(val).isValid() && window.moment.duration(val).asMinutes() > 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Duration"))
			}
		});
		entity.PlannedDuration.extend({
			validation: {
				validator: function (val) {
					if (entity.Username() || entity.Duration()) {
						return true;
					}
					return val && window.moment.duration(val).isValid() && window.moment.duration(val).asMinutes() > 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Duration"))
			}
		});
		entity.From.extend({
			validation: {
				async: true,
				validator: window.OverlappingTimeEntryValidator.bind(entity)
			}
		});
		entity.Username.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Technician")),
				onlyIf: function () {
					return !!entity.Duration();
				}
			}
		});
	});
	ko.validationRules.add("CrmService_ServiceContract", function (entity) {
		entity.Name.extend({
			validation: {
				async: true,
				validator: function (contractNo, params, callback) {
					if (!contractNo) {
						callback(true);
						return;
					}
					window.database.CrmService_ServiceContract
						.filter(function (serviceContract) { return serviceContract.ContractNo === this.contractNo; }, { contractNo: contractNo })
						.toArray()
						.then(function (serviceContracts) {
							callback(serviceContracts.length === 0 || serviceContracts[0].Id === entity.Id());
						});
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Unique").replace("{0}", window.Helper.String.getTranslatedString("ContractNo"))
			}
		});
		entity.FirstAnswerUnitKey.extend({
			validation: {
				validator: function (val) {
					return val;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("FirstAnswerUnitKey")),
				onlyIf: function () {
					return entity.FirstAnswerValue() && entity.FirstAnswerValue() != 0;
				}
			}
		});
		entity.ServiceCompletedUnitKey.extend({
			validation: {
				validator: function (val) {
					return val;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("ServiceCompletedUnitKey")),
				onlyIf: function () {
					return entity.ServiceCompletedValue() && entity.ServiceCompletedValue() != 0;
				}
			}
		});
		entity.Price.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("Price")),
			}
		});
		entity.ServiceCompletedValue.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("ServiceCompletedValue")),
			}
		});
		entity.FirstAnswerValue.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("FirstAnswerValue")),
			}
		});
		entity.ServiceProvisionValue.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("ServiceProvisionValue")),
			}
		});
		entity.SparePartsValue.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("SparePartsValue")),
			}
		});
		entity.PriceCurrencyKey.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("PriceCurrencyKey")),
				onlyIf: function () {
					return !!entity.Price();
				}
			}
		});
		entity.ServiceProvisionUnitKey.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("ServiceProvisionUnitKey")),
				onlyIf: function () {
					return !!entity.ServiceProvisionValue();
				}
			}
		});
		entity.ServiceProvisionPerTimeSpanUnitKey.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("ServiceProvisionPerTimeSpanUnitKey")),
				onlyIf: function () {
					return !!entity.ServiceProvisionValue();
				}
			}
		});
		entity.SparePartsUnitKey.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("SparePartsUnitKey")),
				onlyIf: function () {
					return !!entity.SparePartsValue();
				}
			}
		});
		entity.SparePartsBudgetInvoiceTypeKey.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("SparePartsBudgetInvoiceTypeKey")),
				onlyIf: function () {
					return !!entity.SparePartsValue();
				}
			}
		});
		entity.SparePartsPerTimeSpanUnitKey.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("SparePartsPerTimeSpanUnitKey")),
				onlyIf: function () {
					return !!entity.SparePartsValue();
				}
			}
		});
		entity.ValidFrom.extend({
			validation:
			{
				message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
					.replace("{0}", window.Helper.String.getTranslatedString("ValidFrom"))
					.replace("{1}", window.Helper.String.getTranslatedString("ValidTo")),
				onlyIf: function () {
					return !!entity.ValidTo();
				},
				validator: function (val) {
					return !window.moment(val).isAfter(entity.ValidTo());
				}
			}
		});
		entity.Price.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("Price")),
			}
		});
		entity.ValidTo.extend({
			validation: {
				message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
					.replace("{0}", window.Helper.String.getTranslatedString("ValidFrom"))
					.replace("{1}", window.Helper.String.getTranslatedString("ValidTo").toLowerCase()),
				validator: function (val) {
					if (!!entity.ValidTo() && !!entity.ValidFrom())
						return window.moment(val).add(1, "day").isAfter(entity.ValidFrom());
					else
						return true;
				}
			}
		});
	});
	ko.validationRules.add("CrmService_MaintenancePlan", function (entity) {
		entity.RhythmValue.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("Interval"))
			}
		});
	});
	ko.validationRules.add("CrmService_ServiceObject", function (entity) {
			entity.ObjectNo.extend({
				unique: {
					params: [window.database.CrmService_ServiceObject, 'ObjectNo', entity.Id],
					message: Helper.String.getTranslatedString("RuleViolation.Unique")
						.replace("{0}", Helper.String.getTranslatedString("ObjectNo"))
				}
			});
		});
	ko.validationRules.add("CrmService_Store",
		function (entity) {
			entity.StoreNo.extend({
				unique: {
					params: [window.database.CrmService_Store, 'StoreNo', entity.Id],
					onlyIf: function () {
						return entity.innerInstance.entityState === $data.EntityState.Added;
					},
					message: Helper.String.getTranslatedString("RuleViolation.Unique")
						.replace("{0}", Helper.String.getTranslatedString("StoreNo"))
				},
			});
		});
	ko.validationRules.add("CrmService_Location",
		function (entity) {
			entity.LocationNo.extend({
				unique: {
					params: [window.database.CrmService_Location, 'LocationNo', entity.Id],
					onlyIf: function () {
						return entity.innerInstance.entityState === $data.EntityState.Added;
					},
					message: Helper.String.getTranslatedString("RuleViolation.Unique")
						.replace("{0}", Helper.String.getTranslatedString("LocationNo"))
				},
			});
		});
	ko.validationRules.add("CrmService_ServiceCase", function (entity) {
		entity.ServiceCaseNo.extend({
			unique: {
				params: [window.database.CrmService_ServiceCase, 'ServiceCaseNo', entity.Id],
				onlyIf: function () {
					return entity.innerInstance.entityState === $data.EntityState.Added;
				},
				message: Helper.String.getTranslatedString("RuleViolation.Unique")
					.replace("{0}", Helper.String.getTranslatedString("ServiceCaseNo"))
			}
		});
	});
	ko.validationRules.add("Main_User", function (entity) {
		let extensionValues = ko.unwrap(entity.ExtensionValues);
		if (extensionValues){
			extensionValues.DefaultLocationNo.extend({
				unique: {
					params: [window.database.Main_User, 'ExtensionValues.DefaultLocationNo', entity.Id, "DefaultLocationNo"],
					onlyIf: function(){
						return window.Crm.Service.Settings.UserExtension.OnlyUnusedLocationNosSelectable;
					}
				}
			});
		}
	});
})(window.ko);