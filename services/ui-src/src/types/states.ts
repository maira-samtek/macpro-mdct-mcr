import { AdminBannerData, EntityShape, EntityType, MCRUser } from "types";

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

// initial entity state
export interface McrEntityState {
  // INITIAL STATE
  selectedEntity: EntityShape | undefined;
  entities: EntityShape[] | undefined;
  entityType: EntityType | undefined;
  // ACTIONS
  setSelectedEntity: (newSelectedEntity: EntityShape | undefined) => void;
  clearSelectedEntity: () => void;
  setEntities: (newEntities: EntityShape[] | undefined) => void;
  clearEntities: () => void;
  setEntityType: (newEntityType: EntityType | undefined) => void;
}
