(function($data) {
	var origGetField = $data.Queryable.prototype.specialFunctions.orderByCurrentServiceOrderTime.getField;
	$data.Queryable.prototype.specialFunctions.orderByCurrentServiceOrderTime.getField = function(type) {
		if (window.database.SmsChecklists_ServiceOrderChecklist && type === window.database.SmsChecklists_ServiceOrderChecklist.elementType) {
			return "it.ServiceOrderTimeKey";
		}
		return origGetField.apply(this, arguments);
	};
})($data);