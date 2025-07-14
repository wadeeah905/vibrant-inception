class HelperVisit {
	static getVisitAimAbbreviation(visit, lookup) {
		const lookupValue = lookup[visit.VisitAimKey()];
		if (lookupValue && lookupValue.Value) {
			return lookupValue.Value[0];
		}
		if (visit.CustomAim()) {
			return visit.CustomAim()[0];
		}
		return "";
	}

	static getVisitAimColor(visit, lookup) {
		const lookupValue = lookup[visit.VisitAimKey()];
		return lookupValue ? lookupValue.Color : "#3A87AD";
	}

	static calculateDates(visit) {
		if (!!visit && !!visit.PlannedTime() && !!visit.PlannedDate()) {
			const momentDate = window.moment(visit.PlannedDate());
			const momentTime = window.moment(visit.PlannedTime());
			momentDate.set({"hour": momentTime.get("hour"), "minute": momentTime.get("minute")});
			const momentDateAsUtcString = window.moment.utc(momentDate).format();
			visit.PlannedDate(momentDateAsUtcString);
			visit.PlannedTime(momentDateAsUtcString);
			const momentPlannedDate = window.moment(visit.PlannedDate());
			if (!!visit.PlannedEndDate()) {
				const momentPlannedEndDate = window.moment(visit.PlannedEndDate());
				momentPlannedDate.set({
					"hour": momentPlannedEndDate.get("hour"),
					"minute": momentPlannedEndDate.get("minute")
				});
				const momentEndDateAsUtcString = window.moment.utc(momentPlannedDate).format();
				visit.PlannedEndDate(momentEndDateAsUtcString);

				const duration = window.moment.duration(momentPlannedDate.diff(momentDate));
				const durationString = duration.toString();
				visit.PlannedDuration(durationString);
			} else {
				const momentPlannedEndDate = window.moment(visit.PlannedDate());
				momentPlannedEndDate.set({
					"hour": momentPlannedEndDate.get("hour") + parseInt(window.Crm.VisitReport.Settings.DefaultVisitTimeSpanHours, 10),
					"minute": momentPlannedEndDate.get("minute")
				});
				const momentEndDateAsUtcString = window.moment.utc(momentPlannedEndDate).format();

				visit.PlannedEndDate(momentEndDateAsUtcString);

				const duration = window.moment.duration(momentPlannedEndDate.diff(momentPlannedDate));
				const durationString = duration.toString();
				visit.PlannedDuration(durationString);
			}
		}
		return visit;
	}

	static calculateDuration(visit) {
		if (!!visit && !!visit.PlannedTime() && !!visit.PlannedEndDate()) {
			const plannedDate = visit.PlannedDate();
			const momentDate = window.moment(plannedDate);
			const momentTime = window.moment(visit.PlannedTime());
			momentDate.set({"hour": momentTime.get("hour"), "minute": momentTime.get("minute")});
			const momentPlannedDate = window.moment(plannedDate);
			const momentPlannedEndDate = window.moment(visit.PlannedEndDate());
			momentPlannedDate.set({
				"hour": momentPlannedEndDate.get("hour"),
				"minute": momentPlannedEndDate.get("minute")
			});

			const duration = window.moment.duration(momentPlannedDate.diff(momentDate));
			const durationString = duration.toString();
			visit.PlannedDuration(durationString);
		} else {
			visit.PlannedDuration(null);
		}
		return visit;
	}

	static safeVisitAimSwitch(visit) {
		if (!!visit && visit.VisitAimKey() !== null && !!visit.CustomAim()) {
			const confirmConfig = {
				title: window.Helper.String.getTranslatedString("AreYouSureConfirmation"),
				text: window.Helper.String.getTranslatedString("VisitAimSelectionConfirmation")
			};
			window.Helper.Confirm.genericConfirm(confirmConfig).then(function () {
				visit.CustomAim(null);
			}).fail(function () {
				visit.VisitAimKey(null);
			});
		}
		return visit;
	}

	static setStatus(visit, statusKey) {
		var d = new $.Deferred().resolve().promise();
		if (statusKey === "Completed") {
			d = d.then(function () {
				return window.database.CrmVisitReport_VisitReport
					.filter("it.VisitId === this.Id && it.Completed === false", { Id: visit.Id()})
					.toArray().then(function (reports) {
						if(reports.length){
							statusKey = null;
							return window.Helper.Confirm.genericConfirm({
								text: window.Helper.String.getTranslatedString("OpenVisitReportsWarningMessage"),
								type: "warning",
								showCancelButton: false
							});
						}else{
							return window.Helper.Confirm.genericConfirm({
								title: window.Helper.String.getTranslatedString("Complete"),
								text: window.Helper.String.getTranslatedString("VisitCompleteWarningMessage"),
								type: "warning",
								confirmButtonText: window.Helper.String.getTranslatedString("Complete")
							});
						}
					})
			});
		}
		return d.then(function () {
			if(statusKey){
				window.database.attachOrGet(visit.innerInstance);
				visit.StatusKey(statusKey);
				return window.database.saveChanges();
			}
		});
	}
}

(window.Helper = window.Helper || {}).Visit = HelperVisit;