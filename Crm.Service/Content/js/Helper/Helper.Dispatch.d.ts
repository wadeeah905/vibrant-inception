declare class HelperDispatch {
    static getCurrentJobItemGroup(viewModel: any): any;
    static getDueDispatchesCount(): any;
    static getNewDispatchesCount(): any;
    static filterTechnicianQuery(query: any, term: any, userGroupId: any): any;
    static mapForSelect2Display(dispatch: any): {
        id: any;
        item: any;
        text: any;
    };
    static toggleCurrentJob(dispatch: any, selectedServiceOrderTimeId: any): any;
    static getCalendarBodyText(dispatch: any): string;
}
