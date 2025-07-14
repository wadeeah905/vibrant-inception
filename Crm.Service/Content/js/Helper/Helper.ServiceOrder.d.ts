declare class HelperServiceOrder {
    static belongsToClosed(serviceOrderStatus: any): boolean;
    static canEditActualQuantities(serviceOrderId: any): any;
    static canEditEstimatedQuantities(serviceOrderId: any): any;
    static canEditEstimatedQuantitiesSync(serviceOrderStatus: any, statusGroups: any): any;
    static canEditInvoiceQuantities(serviceOrderId: any): any;
    static formatPosNo(posNo: any): any;
    static getDisplayName(serviceOrder: any): string;
    static getServiceOrderPositionItemGroup(serviceOrderPosition: any): {
        title: any;
    };
    static getServiceOrderTemplateAutocompleteFilter(query: any, term: any): any;
    static isInStatusGroup(serviceOrderId: any, statusGroupOrGroups: any, serviceOrderStatusKey: any): any;
    static isInStatusGroupSync(serviceOrderStatus: any, statusGroupsHaystack: any, statusGroupsNeedles: any): boolean;
    static mapForSelect2Display(serviceOrder: any): {
        id: any;
        item: any;
        text: any;
    };
    static queryServiceOrderType(query: any, term: any): any;
    static setStatus(serviceOrders: any, status: any): void;
    static getMaxPosNo(serviceOrderId: any): any;
    static getNextPosNo(serviceOrderId: any): any;
    static getNextMaterialPosNo(serviceOrderId: any): any;
    static getNextJobPosNo(serviceOrderId: any): any;
    static getTypeAbbreviation(serviceOrder: any, serviceOrderTypes: any): any;
    static transferTemplateData(serviceOrderTemplate: any, serviceOrder: any, revertTemplate: any): any;
    static updatePosNo(serviceOrderPosition: any): any;
    static updateJobPosNo(serviceOrderPosition: any): any;
    static updateMaterialPosNo(serviceOrderPosition: any): any;
    static getRelatedInstallations(serviceOrderHead: any): any[];
}
