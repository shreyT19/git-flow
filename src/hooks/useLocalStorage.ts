import LocalStorageKeyConstants, {
  type ILocalStorageConstantsType,
} from "@/constants/localStorageConstants";
import type { Dispatch, SetStateAction } from "react";
import { useLocalStorage as useLS } from "usehooks-ts";

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};

const useLocalStorage = <T>(
  key: ILocalStorageConstantsType,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>, () => void] => {
  const [storedValue, setValue, removeValue] = useLS(
    LocalStorageKeyConstants[key],
    initialValue,
    options,
  );

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
