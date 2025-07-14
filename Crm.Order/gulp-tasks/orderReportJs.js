const generateJsTask = require("../../../gulp-core/gulptaskCore").generateJsTask;

module.exports = function() {
	let jsFiles = [
		"../../Content/js/ClientInfo.js",
		"../../Content/js/ClientInfo.Material.js",
		"../../Content/js/knockout.custom.js",
		"../../Content/js/knockout.custom.userDisplayName.js",
		"../../Content/js/knockout.custom.distinct.js",
		"../../Content/js/OfflineBootstrapper.js",
		"../../Content/js/ViewModels/ViewModelBase.js",
		"Content/js/Helper/Helper.Order.js",
		"Content/js/BaseOrderDetailsViewModel.js",
		"Content/js/BaseOrderPdfModalViewModel.js",
		"Content/js/OrderPdfModalViewModel.js",
		"Content/js/OfferPdfModalViewModel.js"
	];
	generateJsTask(__filename, jsFiles);
};