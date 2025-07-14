;
(function () {
	function createVisitReportClosedNote(visitReport) {
		const note = window.database.Main_Note.Main_Note.create();
		note.ContactId = visitReport.ReferenceKey;
		note.ContactType = "Company";
		note.DisplayText = window.Helper.String.getTranslatedString("VisitReportClosed");
		note.Files = [];
		note.IsSystemGenerated = true;
		note.Links = [];
		note.NoteType = "VisitReportClosedNote";
		note.Plugin = "Main";
		note.Text = visitReport.Id;
		window.database.add(note);
	}

	function createVisitReportTopicNote(topic) {
		const topicNote = window.database.Main_Note.Main_Note.create();
		topicNote.ContactId = topic.VisitKey;
		topicNote.Subject = topic.Topic;
		topicNote.Text = topic.Description || topic.Topic;
		topicNote.NoteType = "VisitReportTopicNote";
		topicNote.Plugin = "Crm.VisitReport";
		topicNote.IsSystemGenerated = false;
		window.database.add(topicNote);
	}

	const viewModel = {};
	document.addEventListener("DatabaseInitialized", function() {
		if (window.database.CrmVisitReport_VisitReport) {
			window.Helper.Database.registerEventHandlers(viewModel, {
				CrmVisitReport_VisitReport: {
					"beforeCreate": function(sender, items) {
						items = Array.isArray(items) ? items : [items];
						items.forEach(function(item) {
							if (item.Completed === true) {
								createVisitReportClosedNote(item);
							}
						});
					},
					"beforeUpdate": function(sender, items) {
						items = Array.isArray(items) ? items : [items];
						items.forEach(function(item) {
							const hasStatusChanged = !!item.changedProperties.find(function(x) { return x.name === "Completed" });
							if (hasStatusChanged && item.Completed === true) {
								createVisitReportClosedNote(item);
							}
						});
					}
				}
			});
		}
		if (window.database.CrmVisitReport_VisitTopic) {
			window.Helper.Database.registerEventHandlers(viewModel, {
				CrmVisitReport_VisitTopic: {
					"beforeCreate": function(sender, items) {
						items = Array.isArray(items) ? items : [items];
						items.forEach(function(item) {
							createVisitReportTopicNote(item);
						});
					}
				}
			});
		}
	});
})();