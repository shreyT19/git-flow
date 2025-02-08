const LocalStorageKeyConstants = {
  SELECTED_PROJECT_ID: "selectedProjectId",
} as const;

export type ILocalStorageConstantsType = keyof typeof LocalStorageKeyConstants;

export default LocalStorageKeyConstants;
