class HelperInstallationPosition {
	static getPositionColor(installationPosition, articleTypes) {
		const articleTypeKey = installationPosition.Article()?.ArticleTypeKey();
		let bgmColor = "#9e9e9e";
		if (installationPosition.IsInstalled()) {
			if (!!articleTypes && !!articleTypeKey) {
				const articleType = articleTypes[articleTypeKey];
				bgmColor = articleType?.Color;
			}
		}
		return bgmColor;
	}
}
(window.Helper = window.Helper || {}).InstallationPosition = HelperInstallationPosition;