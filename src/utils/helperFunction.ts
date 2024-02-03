import { DicWithNumberKey, DicWithStringKey } from "../models/Lookup";

export function isEmpty(value: string | null | undefined) {
  return (
    value == null || (typeof value === "string" && value.trim().length === 0)
  );
}

export const mapLookupToArray = (
  value: DicWithStringKey
): { value: string; label: string }[] => {
  const result = Object.keys(value).map((item) => {
    return { value: item, label: value[item] };
  });

  return result;
};

export const mapNumberLookupToArray = (
  value: DicWithNumberKey
): { value: string; label: string }[] => {
  const result = Object.keys(value).map((item) => {
    return { value: item, label: value[+item] };
  });

  return result;
};

export const mapLookupStringValueToArray = (
  value: DicWithStringKey
): { value: string; label: string }[] => {
  const result = Object.keys(value).map((item) => {
    return { value: value[item], label: value[item] };
  });

  return result;
};

export const replaceIfNun = (
  originalString: string | null | undefined,
  replaceString: string = "empty"
): string => {
  if (!originalString || originalString == "") {
    return replaceString;
  }
  return originalString;
};
