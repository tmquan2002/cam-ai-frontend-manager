export function isEmpty(value: string | null | undefined) {
  return (
    value == null || (typeof value === "string" && value.trim().length === 0)
  );
}

export function mapLookupToArray<T extends { [key: string]: string | number }>(
  value: T
): { key: string; value: string | number }[] {
  const keys = Object.keys(value);
  return keys.map((key): { key: string; value: string | number } => {
    return {
      key: key,
      value: value[key],
    };
  });
}

export const replaceIfNun = (
  originalString: string | null | undefined,
  replaceString: string = "empty"
): string => {
  if (!originalString || originalString == "") {
    return replaceString;
  }
  return originalString;
};
