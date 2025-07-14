(function(Helper) {
	window.Main.ViewModels.NoteViewModel.registerDisplayTextProvider("VisitReportClosedNote", function(note) {
		var text = Helper.String.getTranslatedString("VisitReportClosed");
		return new $.Deferred().resolve(text).promise();
	});
})(window.Helper = window.Helper || {});