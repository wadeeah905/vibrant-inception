;
(function(ko) {
	namespace("Crm.Service.ViewModels").ServiceOrderReportViewModel = function() {
		var viewModel = this;
		viewModel.customerContact = ko.observable(null);
		viewModel.customerContactAddress = ko.observable(null);
		viewModel.displayedMaterials = ko.observableArray([]);
		viewModel.materials = ko.observableArray([]);
		viewModel.displayedTimePostings = ko.observableArray([]);
		viewModel.displayedMaterialSerials = ko.observableArray([]);
		viewModel.quantityUnits = ko.observableArray([]);
		viewModel.noPreviousSerialNoReasons = ko.observableArray([]);
		viewModel.serviceOrderTimePostings = ko.observableArray([]);
		viewModel.serviceOrderTimes = ko.observableArray([]);
		viewModel.initiator = ko.observable(null);
		viewModel.initiatorPerson = ko.observable(null);
		viewModel.initiatorAddress = ko.observable(null);
		viewModel.initiatorEmail = ko.observable(null);
		viewModel.initiatorPhone = ko.observable(null);
		viewModel.initiatorMobile = ko.observable(null);
		viewModel.installation = ko.observable(null);
		viewModel.installations = ko.observableArray([]);
		viewModel.invoiceRecipient = ko.observable(null);
		viewModel.maintenanceOrderGenerationMode = ko.observable(null);
		viewModel.payer = ko.observable(null);
		viewModel.serviceObject = ko.observable(null);
		viewModel.serviceOrder = ko.observable(null);
		viewModel.site = ko.observable(null);
		viewModel.lookups = {};
		viewModel.headerHeight = ko.observable(0);
		viewModel.footerHeight = ko.observable(0);
		viewModel.suppressEmptyMaterialsInReport = ko.observable(null);
		viewModel.suppressEmptyTimePostingsInReport = ko.observable(null);
		viewModel.suppressEmptyJobsInReport = ko.observable(null);

		viewModel.reportGroups = ko.pureComputed(function() {
			if (ko.unwrap(viewModel.loading)){
				return [];
			}
			if (viewModel.maintenanceOrderGenerationMode() === "OrderPerInstallation") {
				return [
					{
						Installation: viewModel.installation(),
						ServiceOrderTime: null,
						ServiceOrderMaterials: viewModel.displayedMaterials(),
						ServiceOrderTimePostings: viewModel.displayedTimePostings()
					}
				];
			}
			var groupsArray = [];
			var groups = viewModel.serviceOrderTimes().reduce(function(acc, serviceOrderTime) {
				acc[serviceOrderTime.Id()] = {
					Installation: serviceOrderTime.InstallationId() ? viewModel.installations().find(x => x.Id() === serviceOrderTime.InstallationId()) : null,
					ServiceOrderTime: serviceOrderTime,
					ServiceOrderMaterials: [],
					ServiceOrderTimePostings: []
				};
				return acc;
			}, {});
			var positions = viewModel.displayedMaterials().concat(viewModel.displayedTimePostings());
			if (Object.keys(groups).length === 0 || positions.some(x => x.ServiceOrderTimeId() === null)) {
				groups[null] = {
					Installation: null,
					ServiceOrderTime: null,
					ServiceOrderMaterials: [],
					ServiceOrderTimePostings: []
				};
			}
			viewModel.displayedMaterials().forEach(function(position) {
				groups[position.ServiceOrderTimeId()].ServiceOrderMaterials.push(position);
			});
			viewModel.displayedTimePostings().forEach(function(position) {
				groups[position.ServiceOrderTimeId()].ServiceOrderTimePostings.push(position);
			});
			Object.keys(groups).forEach(function(position) {
				groupsArray.push(groups[position]);
			});
			return groupsArray;
		});

		viewModel.sortedReportGroups = ko.pureComputed(function() {
			viewModel.reportGroups().forEach(function(group) {
				group.ServiceOrderMaterials.sort(function(left, right) {
					return parseInt(left.PosNo() || 0) - parseInt(right.PosNo() || 0);
				});
				group.ServiceOrderTimePostings.sort(function(left, right) {
					if (left.From() > right.From()) {
						return 1;
					}
					if (left.From() < right.From()) {
						return -1;
					}
					if (left.ItemNo() > right.ItemNo()) {
						return 1;
					}
					if (left.ItemNo() < right.ItemNo()) {
						return -1;
					}
					return 0;
				});
			});
			return viewModel.reportGroups().sort(function(left, right) {
				var leftPosNo = left.ServiceOrderTime ? parseInt(left.ServiceOrderTime.PosNo()) : 0;
				var rightPosNo = right.ServiceOrderTime ? parseInt(right.ServiceOrderTime.PosNo()) : 0;
				return leftPosNo - rightPosNo;
			});
		});
		viewModel.filterPositions = function(group, types) {
			const obj = ko.unwrap(group.ServiceOrderTime ?? viewModel.serviceOrder);
			const ls = {
				IsCostLumpSum: ko.unwrap(obj.IsCostLumpSum),
				IsMaterialLumpSum: ko.unwrap(obj.IsMaterialLumpSum),
				IsTimeLumpSum: ko.unwrap(obj.IsTimeLumpSum),
			}
			types = Array.isArray(types) ? types : [types];
			if (types.length === 1 && types[0] === "Time") {
				if (ls.IsTimeLumpSum) {
					return [];
				}
				return group.ServiceOrderTimePostings;
			}
			if (types.includes("Cost") || types.included("Material")) {
				return group.ServiceOrderMaterials.filter(x => {
					if (ko.unwrap(x.ArticleTypeKey) === "Cost" && ls.IsCostLumpSum || ko.unwrap(x.ArticleTypeKey) === "Material" && ls.IsMaterialLumpSum) {
						return false;
					}
					return true;
				})
			}
		};
		viewModel.getLumpSumPositionTypes = function(group) {
			const obj = ko.unwrap(group.ServiceOrderTime ?? viewModel.serviceOrder);
			const ls = {
				IsCostLumpSum: ko.unwrap(obj.IsCostLumpSum),
				IsMaterialLumpSum: ko.unwrap(obj.IsMaterialLumpSum),
				IsTimeLumpSum: ko.unwrap(obj.IsTimeLumpSum),
			}
			return {
				Time: ls.IsTimeLumpSum && group.ServiceOrderTimePostings.length > 0,
				Cost: ls.IsCostLumpSum && group.ServiceOrderMaterials.some(x => ko.unwrap(x.ArticleTypeKey) === "Cost"),
				Material: ls.IsMaterialLumpSum && group.ServiceOrderMaterials.some(x => ko.unwrap(x.ArticleTypeKey) === "Material")
			};
		};

		viewModel.showMaterialsTable = function (group) {
			const lumpSumTypes = viewModel.getLumpSumPositionTypes(group);
			return group.ServiceOrderMaterials.length > 0 || lumpSumTypes.Cost || lumpSumTypes.Material || !viewModel.suppressEmptyMaterialsInReport();
		};

		viewModel.showTimePostingsTable = function (group) {
			const lumpSumTypes = viewModel.getLumpSumPositionTypes(group);
			return group.ServiceOrderTimePostings.length > 0 || lumpSumTypes.Time || !viewModel.suppressEmptyTimePostingsInReport();
		};

		viewModel.showGroupHeader = function (group) {
			const jobPerInstallationMode = viewModel.maintenanceOrderGenerationMode() === 'JobPerInstallation';
			return viewModel.showMaterialsTable(group) || viewModel.showTimePostingsTable(group) || (jobPerInstallationMode && !viewModel.suppressEmptyJobsInReport());
		};

	};
	namespace("Crm.Service.ViewModels").ServiceOrderReportViewModel.prototype.init = function(id, params) {
		var viewModel = this;
		Object.getOwnPropertyNames(params || {}).forEach(function(param) {
			if (viewModel[param] && ko.isWritableObservable(viewModel[param])) {
				viewModel[param](ko.unwrap(ko.isObservable(params[param])
					? params[param]
					: ko.wrap.fromJS(params[param])));
			} else {
				viewModel[param] = params[param];
			}
		});

		if (viewModel.serviceOrder() && viewModel.serviceOrder().Installation && viewModel.serviceOrder().Installation()) {
			viewModel.installation(viewModel.serviceOrder().Installation());
		}
		if (viewModel.serviceOrder() && viewModel.serviceOrder().ServiceOrderMaterials && viewModel.serviceOrder().ServiceOrderMaterials()) {
			viewModel.displayedMaterials(viewModel.serviceOrder().ServiceOrderMaterials());
			viewModel.displayedMaterialSerials(viewModel.displayedMaterials()
				.filter(function(x) { return x.IsSerial(); })
				.map(function(material) { return material.ServiceOrderMaterialSerials(); })
				.reduce(function(serials, act) { return serials.concat(act); }, []));
		}
		if (viewModel.serviceOrder() && viewModel.serviceOrder().ServiceOrderTimePostings && viewModel.serviceOrder().ServiceOrderTimePostings()) {
			viewModel.displayedTimePostings(viewModel.serviceOrder().ServiceOrderTimePostings());
		}
		if (viewModel.serviceOrder() && viewModel.serviceOrder().Initiator && viewModel.serviceOrder().Initiator()) {
			viewModel.initiator(viewModel.serviceOrder().Initiator());
		}
		if (viewModel.serviceOrder() && viewModel.serviceOrder().InitiatorPerson && viewModel.serviceOrder().InitiatorPerson()) {
			viewModel.initiatorPerson(viewModel.serviceOrder().InitiatorPerson());
		}
		if (viewModel.serviceOrder() && viewModel.serviceOrder().Company) {
			viewModel.customerContact(viewModel.serviceOrder().Company());
		}
		if (viewModel.customerContact() && viewModel.customerContact().Addresses && viewModel.customerContact().Addresses() && viewModel.customerContact().Addresses().length > 0) {
			viewModel.customerContactAddress(viewModel.customerContact().Addresses()[0]);
		}
		if (viewModel.initiator() && viewModel.initiator().Addresses && viewModel.initiator().Addresses() && viewModel.initiator().Addresses().length > 0) {
			viewModel.initiatorAddress(viewModel.initiator().Addresses()[0]);
		}
		if (viewModel.initiator() && viewModel.initiator().Phones && viewModel.initiator().Phones() && viewModel.initiator().Phones().length > 0) {
			viewModel.initiatorPhone(viewModel.initiator().Phones().filter(function(x) {
					return x.TypeKey !== "PhoneMobile";
				})[0] ||
				null);
			viewModel.initiatorMobile(viewModel.initiator().Phones().filter(function(x) {
					return x.TypeKey === "PhoneMobile";
				})[0] ||
				null);
		}
		if (viewModel.initiator() && viewModel.initiator().Emails && viewModel.initiator().Emails() && viewModel.initiator().Emails().length > 0) {
			viewModel.initiatorEmail(viewModel.initiator().Emails()[0]);
		}
		if (viewModel.initiatorPerson() && viewModel.initiatorPerson().Phones && viewModel.initiatorPerson().Phones() && viewModel.initiatorPerson().Phones().length > 0) {
			viewModel.initiatorPhone(viewModel.initiatorPerson().Phones().filter(function(x) {
					return x.TypeKey !== "PhoneMobile";
				})[0] ||
				viewModel.initiatorPhone());
			viewModel.initiatorMobile(viewModel.initiatorPerson().Phones().filter(function(x) {
					return x.TypeKey === "PhoneMobile";
				})[0] ||
				viewModel.initiatorMobile());
		}
		if (viewModel.initiatorPerson() && viewModel.initiatorPerson().Emails && viewModel.initiatorPerson().Emails() && viewModel.initiatorPerson().Emails().length > 0) {
			viewModel.initiatorEmail(viewModel.initiatorPerson().Emails()[0]);
		}
		if (viewModel.serviceOrder() && viewModel.serviceOrder().InvoiceRecipient && viewModel.serviceOrder().InvoiceRecipient()) {
			viewModel.invoiceRecipient(viewModel.serviceOrder().InvoiceRecipient());
		}
		if (viewModel.serviceOrder() && viewModel.serviceOrder().Payer && viewModel.serviceOrder().Payer()) {
			viewModel.payer(viewModel.serviceOrder().Payer());
		}
		if (viewModel.serviceOrder() && viewModel.serviceOrder().ServiceObject && viewModel.serviceOrder().ServiceObject()) {
			viewModel.serviceObject(viewModel.serviceOrder().ServiceObject());
		}
		if (viewModel.serviceOrder() && viewModel.serviceOrder().ServiceOrderTimes && viewModel.serviceOrder().ServiceOrderTimes()) {
			viewModel.serviceOrderTimes(viewModel.serviceOrder().ServiceOrderTimes());
		}
		if (viewModel.serviceOrderTimes() && viewModel.installations().length === 0) {
			viewModel.installations(viewModel.serviceOrderTimes().filter(function(x) {
				return x.Installation && x.Installation();
			}).map(function(x) {
				return x.Installation();
			}));
		}
		if (!viewModel.maintenanceOrderGenerationMode()) {
			viewModel.maintenanceOrderGenerationMode(window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode);
		}

		if (viewModel.suppressEmptyMaterialsInReport() == null) {
			viewModel.suppressEmptyMaterialsInReport(window.Crm.Service.Settings.Dispatch.SuppressEmptyMaterialsInReport);
		}

		if (viewModel.suppressEmptyTimePostingsInReport() == null) {
			viewModel.suppressEmptyTimePostingsInReport(window.Crm.Service.Settings.Dispatch.SuppressEmptyTimePostingsInReport);
		}

		if (viewModel.suppressEmptyJobsInReport() == null) {
			viewModel.suppressEmptyJobsInReport(window.Crm.Service.Settings.Dispatch.SuppressEmptyJobsInReport);
		}

		if (window.Main &&
			window.Main.Settings &&
			window.Main.Settings.Report) {
			var headerHeight = +window.Main.Settings.Report.HeaderHeight +
				+window.Main.Settings.Report.HeaderSpacing;
			viewModel.headerHeight(headerHeight);
			var footerHeight = +window.Main.Settings.Report.FooterHeight +
				+window.Main.Settings.Report.FooterSpacing;
			viewModel.footerHeight(footerHeight);
		}

		return new $.Deferred().resolve().promise();
	};
})(ko);