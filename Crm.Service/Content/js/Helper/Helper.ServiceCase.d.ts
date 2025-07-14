declare class HelperServiceCase {
    static addServiceCasesToServiceOrder(serviceCases: any, serviceOrderId: any, serviceOrderTimeId: any, maxPos: any): any;
    static belongsToClosed(serviceCaseStatus: any): boolean;
    static defaults: {
        inProgressStatusKey: number;
    };
    static getCategoryAbbreviation(serviceCase: any, serviceCaseCategories: any): any;
    static getDisplayName(serviceCase: any): any;
    static mapForSelect2Display(serviceCase: any): {
        id: any;
        item: any;
        text: any;
    };
    static setStatus(serviceCases: any, status: any): void;
}
