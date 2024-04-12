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

export function removeTime(date: string, separator?: string, format?: "dd/MM/yyyy" | "yyyy/MM/dd") {
  if (format == "yyyy/MM/dd") {
    return (new Date(date).getFullYear()) + (separator || "-")
      + (new Date(date).getMonth() + 1 < 10 ? `0${new Date(date).getMonth() + 1}` : new Date(date).getMonth() + 1) + (separator || "-")
      + (new Date(date).getDate() < 10 ? `0${new Date(date).getDate()}` : new Date(date).getDate())
  }
  return (new Date(date).getDate() < 10 ? `0${new Date(date).getDate()}` : new Date(date).getDate()) + (separator || "-")
    + (new Date(date).getMonth() + 1 < 10 ? `0${new Date(date).getMonth() + 1}` : new Date(date).getMonth() + 1) + (separator || "-")
    + (new Date(date).getFullYear());
}

export function getDateTime(date: string) {
  return removeTime(date, "/") + " " + removeDate(date);
}

export function removeFirstUpdateLastArray<T>(arr: T[], newItem: T) {
  arr.shift();
  arr.push(newItem);
  return arr;
}

export function returnWebsocketConnection(status: number) {
  if (status == -1) return "Uninstantiated";
  if (status == 0) return "Connecting";
  if (status == 1) return "Open";
  if (status == 2) return "Closing";
  if (status == 3) return "Closed or Connect failed";
  return "None"
}

/** Return the day yearLength years before today
 * 
 * @param yearLength 
 * @returns 
 */
export function getDateFromSetYear(yearLength: number) {
  const today = new Date();
  return new Date(today.getFullYear() - yearLength, today.getMonth(), today.getDate());
}