declare class HelperCreateServiceOrderData {
    constructor(serviceOrder: any, serviceOrderTemplate: any, installationIds: any);
    serviceOrder: any;
    serviceOrderTemplate: any;
    invoicingTypes: {};
    installationIds: any;
    serviceOrderData: any[];
    create(): any;
    createDocumentAttributeFromTemplate(documentAttributeTemplate: any, materialId?: any, serviceOrderTimeId?: any): any;
    createJobs(): any;
    createServiceOrderMaterialFromTemplate(serviceOrderMaterialTemplate: any): any;
    createServiceOrderTimePostingFromTemplate(serviceOrderTimePostingTemplate: any): any;
    createServiceOrderTimeFromTemplate(serviceOrderTimeTemplate: any): any;
    createTemplateData(): any;
    setPositionNumbers(): void;
}
