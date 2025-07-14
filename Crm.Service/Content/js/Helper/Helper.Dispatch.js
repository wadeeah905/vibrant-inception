class HelperDispatch {
	static getCurrentJobItemGroup(viewModel) {
		if (!viewModel.dispatch() || !viewModel.dispatch().CurrentServiceOrderTime()) {
			return;
		}
		if (viewModel.items().some(item => item.ServiceOrderTime() && item.ServiceOrderTime().Id() === viewModel.dispatch().CurrentServiceOrderTimeId())){
			return;
		}
		return window.Crm.Service.ViewModels.DispatchDetailsViewModel.prototype.getServicOrderPositionItemGroup.call(viewModel, { ServiceOrderTime: viewModel.dispatch().CurrentServiceOrderTime });
	}
	
	static getDueDispatchesCount() {
		return window.Helper.User.getCurrentUser().then(function (currentUser) {
			return window.database.CrmService_ServiceOrderDispatch
				.filter(function (it) {
						return it.Username === this.username &&
							it.StatusKey in ["Released", "Read", "InProgress", "SignedByCustomer"] &&
							it.Time <= this.now;
					},
					{username: currentUser.Id, now: new Date()})
				.count();
		});
	}

	static getNewDispatchesCount() {
		return window.Helper.User.getCurrentUser().then(function (currentUser) {
			return window.database.CrmService_ServiceOrderDispatch
				.filter(function (it) {
						return it.Username === this.username && it.StatusKey === "Released";
					},
					{username: currentUser.Id})
				.count();
		});
	}

	static filterTechnicianQuery(query, term, userGroupId) {
		if (query && query.GetTechnicians) {
			query = query.GetTechnicians();
		}
		return window.Helper.User.filterUserQuery(query, term?.toLowerCase(), userGroupId);
	}

	static mapForSelect2Display(dispatch) {
		return {
			id: dispatch.Id,
			item: dispatch,
			text: dispatch.ServiceOrder.OrderNo
		};
	}

	static toggleCurrentJob(dispatch, selectedServiceOrderTimeId) {
		const currentServiceOrderTimeId = dispatch().CurrentServiceOrderTimeId();
		window.database.attachOrGet(dispatch().innerInstance);
		return window.database.CrmService_ServiceOrderTime.include("Installation").find(selectedServiceOrderTimeId)
			.then(function (newServiceOrderTime) {
				newServiceOrderTime.CompleteDate = null;
				newServiceOrderTime.CompleteUser = null;
				if (currentServiceOrderTimeId === newServiceOrderTime.Id) {
					dispatch().CurrentServiceOrderTimeId(null);
					dispatch().CurrentServiceOrderTime(null);
					window.database.attachOrGet(newServiceOrderTime);
					newServiceOrderTime.StatusKey = "Interrupted";
				} else {
					dispatch().CurrentServiceOrderTimeId(newServiceOrderTime.Id);
					dispatch().CurrentServiceOrderTime(newServiceOrderTime.asKoObservable());
					window.database.attachOrGet(newServiceOrderTime);
					newServiceOrderTime.StatusKey = "Started";
				}
			}).then(function () {
				if (currentServiceOrderTimeId && currentServiceOrderTimeId !== selectedServiceOrderTimeId) {
					return window.database.CrmService_ServiceOrderTime.find(currentServiceOrderTimeId)
						.then(function (previousServiceOrderTime) {
							if (previousServiceOrderTime.StatusKey === "Started") {
								window.database.attachOrGet(previousServiceOrderTime);
								previousServiceOrderTime.StatusKey = "Interrupted";
							}
						});
				}
			}).then(function () {
				return window.database.saveChanges();
			});
	}

	static getCalendarBodyText(dispatch) {
			let result = "";

			if (dispatch.ServiceOrder().Company() != null) {
				result = result + window.Helper.String.getTranslatedString("Customer") + ": " + Helper.Company.getDisplayName(dispatch.ServiceOrder().Company()) + "\\n";
			}
			if (dispatch.ServiceOrder().Installations() != null) {
				if (dispatch.ServiceOrder().Installations().length === 1) {
					result = result + window.Helper.String.getTranslatedString("Installation") + ": " + window.Helper.Installation.getDisplayName(dispatch.ServiceOrder().Installations()[0]) + "\\n";
				} else if (dispatch.ServiceOrder().Installations().length > 1) {
					result = result + window.Helper.String.getTranslatedString("Installations") + ": ";
					const installationNames = [];
					dispatch.ServiceOrder().Installations().forEach(function (installation) {
						installationNames.push(window.Helper.Installation.getDisplayName(installation));
					});
					result = result + installationNames.join(", ") + "\\n\\n";
				}
			}
			if (dispatch.ServiceOrder().Initiator() != null) {
				result = result + window.Helper.String.getTranslatedString("Initiator") + ": " + window.Helper.Company.getDisplayNameWithAddress(dispatch.ServiceOrder().Initiator()) + "\\n\\n";
			}
			if (dispatch.ServiceOrder().InitiatorPerson() != null) {
				result = result + window.Helper.String.getTranslatedString("InitiatorPerson") + ":\\n";
				result = result + window.Helper.String.getTranslatedString("Name") + ": " + window.Helper.Person.getDisplayNameWithSalutation(dispatch.ServiceOrder().InitiatorPerson()) + "\\n";
				const personContactData = window.Helper.Person.getContactData(dispatch.ServiceOrder().InitiatorPerson());
				if (personContactData.length > 0) {
					result = result + personContactData + "\\n\\n";
				}
			}
			if (dispatch.ServiceOrder().ResponsibleUserUser() != null) {
				result = result + window.Helper.String.getTranslatedString("ResponsibleUser") + ": " + window.Helper.User.getDisplayName(dispatch.ServiceOrder().ResponsibleUserUser()) + "\\n\\n";
			}

			result = result + window.Helper.String.getTranslatedString("ErrorMessage") + ": " + dispatch.ServiceOrder().ErrorMessage();

			return result;
	}
}

(window.Helper = window.Helper || {}).Dispatch = HelperDispatch;