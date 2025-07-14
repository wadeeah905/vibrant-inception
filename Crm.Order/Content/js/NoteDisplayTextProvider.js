(function(Helper) {
	window.Main.ViewModels.NoteViewModel.registerDisplayTextProvider("BaseOrderCreatedNote", function(note) {
		var text = Helper.String.getTranslatedString(note.Text);
		return new $.Deferred().resolve(text).promise();
	});
	window.Main.ViewModels.NoteViewModel.registerDisplayTextProvider("BaseOrderStatusChangedNote", function(note) {
		var key = note.Text;
		if (!key) {
			var set = Helper.String.getTranslatedString(note.Meta + "StatusSet");
			return new $.Deferred().resolve(set).promise();
		}
		if (key === "Closed") {
			var closed = Helper.String.getTranslatedString(note.Meta + "Closed");
			return new $.Deferred().resolve(closed).promise();
		}
		return Helper.Lookup.getLocalizedArrayMap("CrmOrder_OrderStatus").then(function(map) {
			if (map && map[key]) {
				return Helper.String.getTranslatedString(note.Meta + "StatusSetTo").replace("{0}", map[key].Value);
			}
			return key;
		});
	});
})(window.Helper = window.Helper || {});