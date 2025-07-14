/// <reference path="../../../../../Content/js/ViewModels/GenericListViewModel.js" />
namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel = function() {
	var viewModel = this;
	viewModel.distance = window.ko.observable(-1);
	viewModel.filteredDistance = window.ko.observable(-1);
	viewModel.distances = [10, 20, 50, 100, 200];
	viewModel.leafletMap = $('.leaflet-container').data('map');
	viewModel.parentListViewModel = ko.contextFor($('.generic-list')[0]).$root;
	viewModel.maxDistance = 10000;
	viewModel.minDistance = 1;
	viewModel.DistanceValueChangeIntervalMsStart = 125;
	viewModel.DistanceValueChangeIntervalMsStop = 26; 
	viewModel.holdDistanceValueChangeIntervalMs = viewModel.DistanceValueChangeIntervalMsStart;
	viewModel.lastTouchedIncreaseDecreaseElement = null;
	
	var joinAddresses = {
		Selector: "Addresses",
		Operation: "filter(function(a) { return a.IsCompanyStandardAddress === true; })"
	};
	var currentUserName = document.getElementById("meta.CurrentUser").content;
	viewModel.currentUserName = currentUserName;
	window.Main.ViewModels.GeolocationViewModel.apply(viewModel, arguments);
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"Main_Company",
		[],
		[],
		[joinAddresses, "ResponsibleUserUser"]);
	viewModel.enableUrlUpdate(false);
	var someBookmark = {
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("Bookmark"),
		Key: "Bookmark",
		Expression: function (query) {
			if (window.database.storageProvider.name === "oData") {
				return query.filter("function(company) { return company.Addresses.some(function(address) { return address.IsCompanyStandardAddress === true && address.Latitude !== null && address.Longitude !== null && address.Latitude !== 0 && address.Longitude !== 0; }); }");
			} else {
				return query.filter(function (company) {
					return company.Addresses.IsCompanyStandardAddress === true
						&& company.Addresses.Latitude !== null
						&& company.Addresses.Longitude !== null
						&& company.Addresses.Latitude !== 0
						&& company.Addresses.Longitude !== 0;
				});
			}
		}
	};
	viewModel.bookmarks.push(someBookmark);
	viewModel.bookmark(someBookmark);
	viewModel.lookups = {
		companyTypes: {},
		countries: {},
		regions: {},
		timeUnit: {}
	};
};
namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype.applyOrderBy =
	function(query) {
		var viewModel = this;
		if (!viewModel.getLocationPoint()) {
			return query;
		}
		return query.orderBy("orderByStandardAddressDistance", viewModel.getLocationPoint());
	};

namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype.getLocationPoint =
	function () {
		var viewModel = this;
		var customLocation = viewModel.leafletMap?.getLocationPoint();
		if (customLocation) {
			return {
				longitude: customLocation.lng,
				latitude: customLocation.lat,
				fudge: window.Helper.Address.getFudge({ latitude: customLocation.lat, longitude: customLocation.lng })
			};
		}
		else if (viewModel.latitude() && viewModel.longitude() && viewModel.fudge()) {
			return {
				longitude: viewModel.longitude(),
				latitude: viewModel.latitude(),
				fudge: viewModel.fudge()
			};
		}
		return null; 
	}

namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype.init = function() {
	var viewModel = this;

	return window.Main.ViewModels.GeolocationViewModel.prototype.init.apply(viewModel, arguments).then(function (error) {
		if (error) {
			window.Log.warn("getting current position via geolocation api failed, error: " + error.message);
			window.swal({
				confirmButtonText: window.Helper.String.getTranslatedString("Cancel"),
				text: window.Helper.String.getTranslatedString("ReadingCurrentPositionFailed") +
					"\r\n\r\n(" +
					error.message +
					")",
				title: window.Helper.String.getTranslatedString("Error"),
				type: "error"
			});
			return null;
		}
	}).then(function () {
		return window.Helper.Lookup.getLocalizedArrayMap("Main_TimeUnit");
	})
		.then(function (lookup) {
			viewModel.lookups.timeUnit = lookup;
			return window.Helper.Lookup.getLocalizedArrayMap("Main_CompanyType");
		})
		.then(function (lookup) {
			viewModel.lookups.companyTypes = lookup;
			return window.Helper.Lookup.getLocalizedArrayMap("Main_Region");
		})
		.then(function (lookup) {
			viewModel.lookups.regions = lookup;
			return window.Helper.Lookup.getLocalizedArrayMap("Main_Country");
		})
		.then(function (lookup) {
			viewModel.lookups.countries = lookup;
			return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments);
		}).then(function () {
			if (viewModel.leafletMap && viewModel.leafletMap.getSearchRadiusCircleRadiusKm() !== -1) {
				viewModel.setDistance(viewModel.leafletMap.getSearchRadiusCircleRadiusKm());
			}
		});
};
namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype.dispose = function() {
	return window.Main.ViewModels.GeolocationViewModel.prototype.dispose.apply(this, arguments);
};
namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype.getDirection =
	function (company) {
		var viewModel = this;
		var address = company.Addresses()[0];
		let location = viewModel.getLocationPoint();
		if (!location) {
			return;
        }
		return window.Main.ViewModels.GeolocationViewModel.prototype.getDirection.call(this, address, location.longitude, location.latitude );
	};
namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype.getDistance =
	function (company) {
		var viewModel = this;
		if (!viewModel.latitude() && !viewModel.leafletMap?.getLocationPoint()) {
			return null;
		}
		var address = company.Addresses()[0];
		if (viewModel.leafletMap?.getLocationPoint()) {
			var distanceMeters = L.latLng([address.Latitude(), address.Longitude()]).distanceTo(viewModel.leafletMap.getLocationPoint());
			return (distanceMeters / 1000).toFixed(0) + ' km';
		}
		return window.Main.ViewModels.GeolocationViewModel.prototype.getDistance.call(this, address).call();
	};

namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype.holdIncreaseDecreaseDistance =
	function (isIncreaseOrDecrease, event) {
		if (!event || event.button !== 0 && event.type !== 'touchstart')
			return;
		var viewModel = this;
		viewModel.lastTouchedIncreaseDecreaseElement = event.target;
		if (isIncreaseOrDecrease) {
			viewModel.distance() < viewModel.maxDistance && viewModel.distance(viewModel.distance() + 1);
        } else {
			viewModel.distance() > viewModel.minDistance && viewModel.distance(viewModel.distance() - 1);
        }
		if (viewModel.holdDistanceValueChangeIntervalMs >= viewModel.DistanceValueChangeIntervalMsStop) {
			viewModel.holdDistanceValueChangeIntervalMs -= 4;
        }
		viewModel.increaseTimer = setTimeout(() => viewModel.holdIncreaseDecreaseDistance(isIncreaseOrDecrease,event), viewModel.holdDistanceValueChangeIntervalMs);
	}

namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype.releaseIncreaseDecreaseDistance =
	function () {
		var viewModel = this;
		viewModel.holdDistanceValueChangeIntervalMs = viewModel.DistanceValueChangeIntervalMsStart;
		clearTimeout(viewModel.increaseTimer);
		if (viewModel.filteredDistance() != viewModel.distance()) {
			viewModel.setDistance(viewModel.distance());
        }
	}

namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype.setDistance =
	async function (distance) {
		var viewModel = this;
		viewModel.loading(true);
		if (!viewModel.leafletMap?.getLocationPoint() && !viewModel.latitude() || distance < -1 || distance > viewModel.maxDistance) {
			return;
		}
		if (distance === -1) {
			viewModel.resetFilter();
			viewModel.leafletMap?.removeSearchRadiusCircle();
			viewModel.distance(distance);
			viewModel.parentListViewModel.searchOnMap() && viewModel.parentListViewModel.searchOnMap(false);
			return;
		}
		viewModel.distance(distance);
		var rawData = await viewModel.getFilterQuery(true, true, null).toArray();
		var observableDataArray = rawData.map((item) => viewModel.initItem(item));

		observableDataArray = observableDataArray.filter(
			(item) => {
				var distanceString = viewModel.getDistance(item);
				var distanceValue = distanceString.split(' ')[0];
				return distanceValue <= viewModel.distance();
			}
		);
		viewModel.filteredDistance(viewModel.distance());
		viewModel.items(observableDataArray);
		viewModel.totalItemCount(observableDataArray.length);

		if (viewModel.leafletMap?.getLocationPoint() && viewModel.parentListViewModel.showMap()) {
			viewModel.leafletMap?.setSearchRadiusCircle(viewModel.distance());
			!viewModel.parentListViewModel.searchOnMap() && viewModel.parentListViewModel.searchOnMap(true);
		}
		viewModel.loading(false);
	};

namespace("Crm.VisitReport.ViewModels").VisitListCircuitVisitIndexRightNavViewModel.prototype.handleTouchMove =
	function (viewModel,event) {
		var viewModel = this;
		var touch = event.originalEvent.touches[0]
		if (viewModel.lastTouchedIncreaseDecreaseElement && viewModel.lastTouchedIncreaseDecreaseElement !== document.elementFromPoint(touch.pageX, touch.pageY)) {
			viewModel.releaseIncreaseDecreaseDistance();
			viewModel.lastTouchedIncreaseDecreaseElement = null;
		}
	}