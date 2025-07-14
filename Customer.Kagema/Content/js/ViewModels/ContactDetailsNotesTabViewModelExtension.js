;
(function(ko, helper, moment) {
	const contactDetailsNotesTabViewModel = window.Main.ViewModels.ContactDetailsNotesTabViewModel;
	window.Main.ViewModels.ContactDetailsNotesTabViewModel = function() {
		const viewModel = this;
		contactDetailsNotesTabViewModel.apply(this, arguments);
		viewModel.replicationGroups = ko.observableArray([]);
		viewModel.replicationGroupSettings = ko.observableArray([]);
		viewModel.replicationHint = ko.observable(null);
	};
	window.Main.ViewModels.ContactDetailsNotesTabViewModel.prototype = contactDetailsNotesTabViewModel.prototype;
	const init = window.Main.ViewModels.ContactDetailsNotesTabViewModel.prototype.init;
	window.Main.ViewModels.ContactDetailsNotesTabViewModel.prototype.init = async function() {
		const viewModel = this;
		await init.apply(viewModel, arguments);
		if (helper.Offline.status === "online" || !window.database.Main_ReplicationGroup || !window.database.MainReplication_ReplicationGroupSetting) {
			return;
		}
		const noteHistorySettings = await window.database.MainReplication_ReplicationGroupSetting.filter("it.Name === 'NoteHistory' && it.IsEnabled === true").take(1).toArray();
		let noteHistorySetting = noteHistorySettings.length > 0 ? noteHistorySettings[0] : null;
		let defaultNoteHistoryParameter = null;
		if (noteHistorySetting === null) {
			const replicationGroup = await window.database.Main_ReplicationGroup.first("it.Key === 'NoteHistory'");
			defaultNoteHistoryParameter = replicationGroup && replicationGroup.DefaultValue;
		}
		const noteHistorySince = noteHistorySetting ? noteHistorySetting.Parameter : defaultNoteHistoryParameter;
		if (noteHistorySince === 0) {
			return;
		}
		const maxContactHistoryDays = viewModel.minDate() ? moment().diff(viewModel.minDate(), "days") : null;
		if (maxContactHistoryDays !== null && noteHistorySince >= maxContactHistoryDays) {
			return;
		}
		viewModel.replicationHint(helper.String.getTranslatedString("IncompleteNoteHistoryHint").replace("{0}", noteHistorySince));
	};
})(window.ko, window.Helper, window.moment);