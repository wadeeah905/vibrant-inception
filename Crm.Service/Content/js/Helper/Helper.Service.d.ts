declare function setupService(): void;
declare class HelperService {
    static getLumpSumString(obj: any): string | boolean;
    static onInvoicingTypeSelected(obj: any, invoicingType: any): void;
    static resetInvoicingType(entity: any): Promise<void>;
    static resetPositions(entity: any): Promise<any>;
    static resetInvoicingIfLumpSumSettingsChanged(obj: any): Promise<void>;
}
