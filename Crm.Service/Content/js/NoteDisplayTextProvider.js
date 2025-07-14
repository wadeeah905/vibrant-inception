(function(Helper) {
	window.Main.ViewModels.NoteViewModel.registerDisplayTextProvider("ServiceOrderDispatchCompletedNote", function(note) {
		var text = Helper.String.getTranslatedString("DispatchCompleted");
		return new $.Deferred().resolve(text).promise();
	});
	window.Main.ViewModels.NoteViewModel.registerDisplayTextProvider("ServiceOrderHeadCreatedNote", function(note) {
		var text = Helper.String.getTranslatedString("ServiceOrderHeadCreated");
		return new $.Deferred().resolve(text).promise();
	});
	window.Main.ViewModels.NoteViewModel.registerDisplayTextProvider("ServiceContractStatusChangedNote", function(note) {
		var text = Helper.String.getTranslatedString("ServiceContractStatusSet").replace("{0}", note.Text);
		return new $.Deferred().resolve(text).promise();
	});
	window.Main.ViewModels.NoteViewModel.registerDisplayTextProvider("ServiceCaseStatusChangedNote", function(note) {
		var text = Helper.String.getTranslatedString("ServiceCaseStatusSet").replace("{0}", note.Text);
		return new $.Deferred().resolve(text).promise();
	});
	window.Main.ViewModels.NoteViewModel.registerDisplayTextProvider("OrderStatusChangedNote", function(note) {
		var key = note.Text;
		return Helper.Lookup.getLocalizedArrayMap("CrmService_ServiceOrderStatus").then(function(map) {
			if (map && map[key]) {
				return Helper.String.getTranslatedString("ServiceOrderStatusSetTo").replace("{0}", map[key].Value);
			}
			return "";
		}).then(function(text) {
			if (key === "ReadyForInvoice" && note.Meta) {
				var split = note.Meta.split(";");
				var invoiceReasonKey = split[0];
				var invoiceRemark = split[1];
				text += "\r\n";
				return Helper.Lookup.getLocalizedArrayMap("CrmService_ServiceOrderInvoiceReason").then(function(map) {
					if (map && map[invoiceReasonKey]) {
						text += Helper.String.getTranslatedString("InvoiceReason");
						text += ": " + map[invoiceReasonKey].Value;
						if (invoiceRemark) {
							text += " (" + invoiceRemark + ")";
						}
					}
					return text;
				});
			}
			return text || key;
		});
	});
})(window.Helper = window.Helper || {});