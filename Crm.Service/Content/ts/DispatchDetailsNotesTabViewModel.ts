///<reference path="../../../../Content/@types/index.d.ts" />
import {namespace} from "../../../../Content/ts/namespace";

export class DispatchDetailsNotesTabViewModel extends window.Crm.Service.ViewModels.ServiceOrderDetailsNotesTabViewModel {
}

namespace("Crm.Service.ViewModels").DispatchDetailsNotesTabViewModel = DispatchDetailsNotesTabViewModel;

(function() {
	var noteEditModalViewModel = namespace("Main.ViewModels").NoteEditModalViewModel;
	namespace("Main.ViewModels").NoteEditModalViewModel = function(parentViewModel) {
		var viewModel = this;
		viewModel.parentViewModel = parentViewModel;
		noteEditModalViewModel.apply(viewModel, arguments);
	};
	namespace("Main.ViewModels").NoteEditModalViewModel.prototype = noteEditModalViewModel.prototype;
	var init = namespace("Main.ViewModels").NoteEditModalViewModel.prototype.init;
	namespace("Main.ViewModels").NoteEditModalViewModel.prototype.init = function(id) {
		var viewModel = this;
		return init.apply(viewModel, arguments).then(function() {
			if (viewModel.parentViewModel instanceof window.Crm.Service.ViewModels.DispatchDetailsViewModel) {
				viewModel.note().Plugin("Crm.Service");
				viewModel.note().ExtensionValues().DispatchId(viewModel.parentViewModel.dispatch().Id());
			}
		});
	};
})();