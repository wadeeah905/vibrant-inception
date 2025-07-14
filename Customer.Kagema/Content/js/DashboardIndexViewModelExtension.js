(function () {
	//var baseViewModel = window.Main.ViewModels.DashboardIndexViewModel;
	//window.Main.ViewModels.DashboardIndexViewModel = function () {
	//	baseViewModel.apply(this, arguments);
	//	//[...]
	//	//constructors are expected to run only synchronous code
	//};
	//window.Main.ViewModels.DashboardIndexViewModel.prototype = baseViewModel.prototype;

	//var baseInit = baseViewModel.prototype.init;
	//window.Main.ViewModels.DashboardIndexViewModel.prototype.init = function () {
	//	//example how to run before baseInit using arrow functions,
	//	//https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions
	//	return database.Main_Company.take(1).toArray(companies => {
	//		//[...] do important stuff
	//	}).then(() => {
	//		return baseInit.apply(this, arguments);
	//	});
	//};

	//var baseInit = baseViewModel.prototype.init;
	//window.Main.ViewModels.DashboardIndexViewModel.prototype.init = function () {
	//	var viewModel = this;
	//	//example how to run after baseInit
	//	//https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
	//	//https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/call
	//	return baseInit.apply(this, arguments).then(function () {
	//		//[...] do important stuff
	//	});
	//};

	//var baseInit = baseViewModel.prototype.init;
	//window.Main.ViewModels.DashboardIndexViewModel.prototype.init = function () {
	//	//example how to run before baseInit
	//	var baseArguments = arguments;
	//	var viewModel = this;
	//	return database.Main_Company.take(1).toArray(function (companies) {
	//		//[...] do important stuff
	//	}).then(function () {
	//		return baseInit.apply(viewModel, baseArguments);
	//	});
	//};
})();