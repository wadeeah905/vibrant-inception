class HelperOrder {

	static closeSidebar() {
		const $toggled = $(".sidebar.toggled");
		$(".open[data-trigger=\"#right-nav\"]").removeClass("open");
		$toggled.removeClass("toggled");
		$("#header").removeClass("sidebar-toggled");
		$toggled.trigger("sidebar.closed");
	}

	static getTypeAbbreviation(order, orderEntryTypes) {
		order = window.ko.unwrap(order || {});
		const orderEntryTypeKey = window.ko.unwrap(order.OrderEntryType);
		if (orderEntryTypeKey) {
			const orderEntryType = (orderEntryTypes || {})[orderEntryTypeKey];
			if (orderEntryType && orderEntryType.Value) {
				return orderEntryType.Value[0];
			}
		}
		return "";
	}
}

(window.Helper = window.Helper || {}).Order = HelperOrder;