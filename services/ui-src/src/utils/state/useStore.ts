import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// types
import {
  AdminBannerData,
  AdminBannerState,
  EntityShape,
  EntityType,
  McrEntityState,
  MCRUser,
  McrUserState,
} from "types";

// USER STORE
const userStore = (set: Function) => ({
  // initial state
  user: undefined,
  // show local logins
  showLocalLogins: undefined,
  // actions
  setUser: (newUser?: MCRUser) =>
    set(() => ({ user: newUser }), false, { type: "setUser" }),
  // toggle show local logins (dev only)
  setShowLocalLogins: () =>
    set(() => ({ showLocalLogins: true }), false, { type: "showLocalLogins" }),
});

// ADMIN BANNER STORE
const bannerStore = (set: Function) => ({
  // initial state
  bannerData: undefined,
  bannerActive: false,
  bannerLoading: false,
  bannerErrorMessage: "",
  bannerDeleting: false,
  // actions
  setBannerData: (newBanner: AdminBannerData | undefined) =>
    set(() => ({ bannerData: newBanner }), false, { type: "setBannerData" }),
  clearAdminBanner: () =>
    set(() => ({ bannerData: undefined }), false, { type: "clearAdminBanner" }),
  setBannerActive: (bannerStatus: boolean) =>
    set(() => ({ bannerActive: bannerStatus }), false, {
      type: "setBannerActive",
    }),
  setBannerLoading: (loading: boolean) =>
    set(() => ({ bannerLoading: loading }), false, {
      type: "setBannerLoading",
    }),
  setBannerErrorMessage: (errorMessage: string) =>
    set(() => ({ bannerErrorMessage: errorMessage }), false, {
      type: "setBannerErrorMessage",
    }),
  setBannerDeleting: (deleting: boolean) =>
    set(() => ({ bannerDeleting: deleting }), false, {
      type: "setBannerDeleting",
    }),
});

// ENTITY STORE
const entityStore = (set: Function) => ({
  // initial state
  selectedEntity: undefined,
  entities: undefined,
  entityType: undefined,
  // actions
  setSelectedEntity: (newSelectedEntity: EntityShape | undefined) =>
    set(
      () => ({
        selectedEntity: newSelectedEntity,
      }),
      false,
      {
        type: "setSelectedEntity",
      }
    ),
  clearSelectedEntity: () =>
    set(() => ({ selectedEntity: undefined }), false, {
      type: "clearSelectedEntity",
    }),
  setEntities: (newEntities: EntityShape[] | undefined) =>
    set(
      () => ({
        entities: newEntities,
      }),
      false,
      {
        type: "setEntities",
      }
    ),
  clearEntities: () =>
    set(() => ({ entities: undefined }), false, {
      type: "clearEntities",
    }),
  setEntityType: (newEntityType: EntityType | undefined) =>
    set(
      () => ({
        entityType: newEntityType,
      }),
      false,
      {
        type: "setEntityType",
      }
    ),
});

export const useStore = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<McrUserState & AdminBannerState & McrEntityState>((set) => ({
      ...userStore(set),
      ...bannerStore(set),
      ...entityStore(set),
    })),
    {
      name: "mcr-store",
    }
  )
);
