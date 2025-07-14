declare class HelperServiceObject {
    static getCategoryAbbreviation(serviceObject: any, serviceObjectCategories: any): any;
    /** @returns {string} */
    static getDisplayName(serviceObject: any): string;
    static mapForSelect2Display(serviceObject: any): {
        id: any;
        item: any;
        text: any;
    };
}
