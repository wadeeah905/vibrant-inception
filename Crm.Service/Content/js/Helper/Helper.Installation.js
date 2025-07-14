class HelperInstallation {
	static getDisplayName(installation) {
		if (!installation) {
			return "";
		}
		let displayName = [ko.unwrap(installation.InstallationNo), ko.unwrap(installation.Description)]
			.filter(Boolean).join(" - ");
		if (ko.unwrap(installation.LegacyInstallationId)) {
			displayName += " (" + ko.unwrap(installation.LegacyInstallationId) + ")";
		}
		return displayName;
	}

	static getTypeAbbreviation(installation, installationTypes) {
		installation = window.ko.unwrap(installation || {});
		const installationTypeKey = window.ko.unwrap(installation.InstallationTypeKey);
		if (installationTypeKey) {
			const installationType = (installationTypes || {})[installationTypeKey];
			if (installationType && installationType.Value) {
				return installationType.Value[0];
			}
		}
		return "";
	}

	static mapForSelect2Display(installation) {
		return {
			id: installation.Id,
			item: installation,
			text: Helper.Installation.getDisplayName(installation)
		};
	}

	static mapInstallationPositionForSelect2Display(installationPosition) {
		let viewModel = this;
		var displayedObject = {
			id: installationPosition.Id,
			text: installationPosition.PosNo +
				". " +
				installationPosition.ItemNo +
				" - " +
				installationPosition.Description,
			item: installationPosition
		};
		if (!!viewModel.lookups?.articleTypes && !!installationPosition.Article) {
			displayedObject.text += " (" + Helper.Lookup.getLookupValue(viewModel.lookups.articleTypes, installationPosition.Article?.ArticleTypeKey) + ")";
		}
		return displayedObject;
	}

	static updatePosNo(installationPosition) {
		if (installationPosition.PosNo()) {
			return new $.Deferred().resolve().promise();
		}
		let posNo = 1;
		return window.database.CrmService_InstallationPos.filter(
			function (it) {
				return it.InstallationId === this.installationId;
			},
			{installationId: installationPosition.InstallationId()})
			.orderByDescending("it.PosNo")
			.take(1)
			.toArray()
			.then(function (results) {
				if (results.length > 0) {
					posNo = Math.max(posNo, parseInt(results[0].PosNo) + 1);
				}
				installationPosition.PosNo(posNo < 10000
					? ("0000" + posNo.toString()).slice(-4)
					: posNo.toString());
			});
	}
}

(window.Helper = window.Helper || {}).Installation = HelperInstallation;