import {
  AdminBannerData,
  EntityShape,
  MCRUser,
  ReportMetadataShape,
  ReportShape,
} from "types";

// initial user state
export interface McrUserState {
  // INITIAL STATE
  user?: MCRUser;
  showLocalLogins: boolean | undefined;
  // ACTIONS
  setUser: (newUser?: MCRUser) => void;
  setShowLocalLogins: (showLocalLogins: boolean) => void;
}

// initial admin banner state
export interface AdminBannerState {
  // INITIAL STATE
  bannerData: AdminBannerData | undefined;
  bannerActive: boolean;
  bannerLoading: boolean;
  bannerErrorMessage: string;
  bannerDeleting: boolean;
  // ACTIONS
  setBannerData: (newBannerData: AdminBannerData | undefined) => void;
  clearAdminBanner: () => void;
  setBannerActive: (bannerStatus: boolean) => void;
  setBannerLoading: (bannerLoading: boolean) => void;
  setBannerErrorMessage: (bannerErrorMessage: string) => void;
  setBannerDeleting: (bannerDeleting: boolean) => void;
}

// initial report state
export interface McrReportState {
  // INITIAL STATE
  report: ReportShape | undefined;
  reportsByState: ReportMetadataShape[] | undefined;
  submittedReportsByState: ReportMetadataShape[] | undefined;
  lastSavedTime: string | undefined;
  // ACTIONS
  setReport: (newReport: ReportShape | undefined) => void;
  setReportsByState: (
    newReportsByState: ReportMetadataShape[] | undefined
  ) => void;
  clearReportsByState: () => void;
  setSubmittedReportsByState: (
    newSubmittedReportsByState: ReportMetadataShape[] | undefined
  ) => void;
  setLastSavedTime: (lastSavedTime: string | undefined) => void;
}

// initial entity state
export interface McrEntityState {
  // INITIAL STATE
  selectedEntity: EntityShape | undefined;
  // ACTIONS
  setSelectedEntity: (newSelectedEntity: EntityShape | undefined) => void;
  clearSelectedEntity: () => void;
}
