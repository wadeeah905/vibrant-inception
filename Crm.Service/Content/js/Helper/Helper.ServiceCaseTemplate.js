class HelperServiceCaseTemplate {
	static mapForSelect2Display(serviceCaseTemplate) {
		return {
			id: serviceCaseTemplate.Id,
			item: serviceCaseTemplate,
			text: serviceCaseTemplate.Name
		};
	}
}

(window.Helper = window.Helper || {}).ServiceCaseTemplate = HelperServiceCaseTemplate;