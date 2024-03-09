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

export function removeDate(date: string, withSecond?: boolean) {
  if (withSecond) {
    return (new Date(date).getHours() < 10 ? `0${new Date(date).getHours()}` : new Date(date).getHours()) + ":"
      + (new Date(date).getMinutes() < 10 ? `0${new Date(date).getMinutes()}` : new Date(date).getMinutes()) + ":"
      + (new Date(date).getSeconds() < 10 ? `0${new Date(date).getSeconds()}` : new Date(date).getSeconds());
  } else {
    return (new Date(date).getHours() < 10 ? `0${new Date(date).getHours()}` : new Date(date).getHours()) + ":"
      + (new Date(date).getMinutes() < 10 ? `0${new Date(date).getMinutes()}` : new Date(date).getMinutes());
  }
}

export function removeFirstUpdateLastArray<T>(arr: T[], newItem: T, maxLength: number) {
  if (arr.length > maxLength) return arr;

  if (arr.length == maxLength) {
    arr.shift();
  }

  arr.push(newItem);
  return arr;
}