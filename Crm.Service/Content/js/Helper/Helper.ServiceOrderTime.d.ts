declare class HelperServiceOrderTime {
    static calculateEstimatedDuration(serviceOrderTimeId: any, serviceOrderTimePostingIdToSkip: any, additionalDuration: any): Promise<void>;
    /** @returns {string[]} */
    static getAutocompleteColumns(): string[];
    /** @returns {string} */
    static getAutocompleteDisplay(serviceOrderTime: any, currentServiceOrderTimeId: any): string;
    /** @returns {string[]} */
    static getAutocompleteJoins(): string[];
    /** @returns {{item, id: string, text: string}} */
    static mapForSelect2Display(serviceOrderTime: any): {
        item;
        id: string;
        text: string;
    };
}
