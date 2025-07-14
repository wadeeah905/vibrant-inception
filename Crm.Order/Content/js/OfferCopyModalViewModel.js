namespace("Crm.Order.ViewModels").OfferCopyModalViewModel = function (parentViewModel) {
    var viewModel = this;
    viewModel.errors = window.ko.validation.group(viewModel, {deep: true});
    viewModel.loading = window.ko.observable(false);
    viewModel.shouldCopyCalculationPositions = window.ko.observable(true);
    viewModel.getCurrencyValue = namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.getCurrencyValue;
    viewModel.lookups = {currencies: {$tableName: 'Main_Currency'}};
    viewModel.offer = parentViewModel.offer;
    viewModel.offerItems = parentViewModel.orderItems;
    viewModel.calculationPositions = ko.observableArray([]);
    viewModel.newOffer = window.ko.observable(null);
    viewModel.newOfferItems = window.ko.observableArray([]);
    viewModel.newCalculationPositions = ko.observableArray([]);
}
namespace("Crm.Order.ViewModels").OfferCopyModalViewModel.prototype.init = function () {
    var viewModel = this;
    viewModel.loading(true);
    
    var newOffer = window.database.CrmOrder_Offer.CrmOrder_Offer.create(viewModel.offer().innerInstance);
    newOffer.Id = window.$data.createGuid().toString().toLowerCase();
    newOffer.IsLocked = false;
    newOffer.SendConfirmation = false;
    newOffer.ConfirmationSent = false;
    newOffer.IsExported = false;
    newOffer.ReadyForExport = false;
    newOffer.CancelReasonCategoryKey = null;
    newOffer.CancelReasonText = null;
    newOffer.ReadyForExport = false;
    newOffer.StatusKey = "Open";
    newOffer.OrderDate = new Date();
    viewModel.newOffer(newOffer.asKoObservable());
    
    viewModel.offerItems().forEach(function (offerItem) {
        var newOfferItem = window.database.CrmOrder_OrderItem.CrmOrder_OrderItem.create(offerItem.innerInstance);
        newOfferItem.Id = window.$data.createGuid().toString().toLowerCase();
        newOfferItem.OrderId = newOffer.Id;
        viewModel.newOfferItems().push(newOfferItem.asKoObservable());
    });
    return window.database.CrmOrder_CalculationPosition.filter(function (pos) {
        return pos.BaseOrderId === this.baseOrderId;
    }, { baseOrderId: viewModel.offer().Id() }).toArray(viewModel.calculationPositions);
}
namespace("Crm.Order.ViewModels").OfferCopyModalViewModel.prototype.submit = function () {
    var viewModel = this;

    if (viewModel.errors().length > 0) {
        viewModel.errors.showAllMessages();
        return false;
    }

    viewModel.loading(true);

    window.database.add(viewModel.newOffer().innerInstance);
    viewModel.newOfferItems()
        .forEach(function (offerItem) {
            offerItem.OrderId = viewModel.newOffer().Id();
            window.database.add(offerItem.innerInstance);
        });
    if(viewModel.shouldCopyCalculationPositions()){
        viewModel.calculationPositions().forEach(function (pos) {
            var newPos = window.database.CrmOrder_CalculationPosition.CrmOrder_CalculationPosition.create(pos.innerInstance);
            newPos.Id = window.$data.createGuid().toString().toLowerCase();
            viewModel.newCalculationPositions().push(newPos.asKoObservable());
        });
        viewModel.newCalculationPositions()
            .forEach(function (pos) {
                pos.BaseOrderId(viewModel.newOffer().Id());
                window.database.add(pos.innerInstance);
            });
    }
    return window.NumberingService.getNextFormattedNumber(window.Crm.Order.ViewModels.OfferCreateViewModel.prototype.numberingSequence)
        .pipe(function (offerNo) {
            viewModel.newOffer().OrderNo(offerNo);
            return window.database.saveChanges();
        }).pipe(function () {
            viewModel.loading(false);
            window.location.hash = "/Crm.Order/Offer/Details/" + viewModel.newOffer().Id();
        });
};