declare class HelperInstallation {
    static getDisplayName(installation: any): string;
    static getTypeAbbreviation(installation: any, installationTypes: any): any;
    static mapForSelect2Display(installation: any): {
        id: any;
        item: any;
        text: any;
    };
    static mapInstallationPositionForSelect2Display(installationPosition: any): {
        id: any;
        text: string;
        item: any;
    };
    static updatePosNo(installationPosition: any): any;
}
