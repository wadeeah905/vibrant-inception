declare class HelperServiceOrderChecklist {
    static getTitle(serviceOrderChecklist: any): any;
    static mapForSelect2Display(serviceOrderChecklist: any): {
        id: any;
        item: any;
        text: any;
    };
    static hasPendingServiceCase(): any;
    static hasPendingFormResponse(): any;
    static serviceCaseIsDraft(serviceCase: any): any;
}
