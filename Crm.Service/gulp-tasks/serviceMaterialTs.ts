import "../Content/ts/ArticleDetailsViewModelExtension";
import "../Content/ts/UserDetailsViewModelExtension";
import "../Content/ts/ServiceOrderDetailsNotesTabViewModel";
import "../Content/ts/DispatchDetailsNotesTabViewModel";
import "../Content/ts/DispatchDetailsRelatedOrdersTabViewModel";
import "../Content/ts/InstallationDetailsNotesTabViewModel";
import "../Content/ts/LocationEditModalViewModel";
import "../Content/ts/ServiceCaseDetailsNotesTabViewModel";
import "../Content/ts/ServiceOrderNoInvoiceModalViewModel";
import "../Content/ts/ServiceContractDetailsNotesTabViewModel";
import "../Content/ts/ServiceObjectDetailsNotesTabViewModel";
import "../Content/ts/ServiceOrderTemplateDetailsNotesTabViewModel";
import "../Content/ts/StoreEditModalViewModel";
import "../Content/ts/StoreDetailsLocationsTabViewModel";
import "../Content/ts/StoreDetailsViewModel";
import "../Content/ts/StoreListIndexViewModel";
import {HelperStatisticsKey} from "../Content/ts/helper/Helper.StatisticsKey";

import {helperBase as Helper, mergeDeep} from "../../../Content/ts/helper/helper";
import accountUserProfileViewModelExtensions from "../Content/ts/AccountUserProfileViewModelExtension";
accountUserProfileViewModelExtensions();

window.Helper = mergeDeep(window.Helper, Helper);
window.Helper.StatisticsKey ||= HelperStatisticsKey;