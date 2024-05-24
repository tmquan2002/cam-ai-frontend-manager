import dayjs from "dayjs";
import {
  ActiveStatusGroup,
  IdleStatusGroup,
  InactiveStatusGroup,
  MiddleStatusGroup,
  ReportInterval,
  StatusColor,
  StatusColorLight,
} from "../models/CamAIEnum";
import { MetaData, TaskError } from "../models/Task";

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
  replaceString: string = "No Data"
): string => {
  if (!originalString || originalString == "") {
    return replaceString;
  }
  return originalString;
};

export function removeDate(date: string, withSecond?: boolean) {
  if (withSecond) {
    return (
      (new Date(date).getHours() < 10
        ? `0${new Date(date).getHours()}`
        : new Date(date).getHours()) +
      ":" +
      (new Date(date).getMinutes() < 10
        ? `0${new Date(date).getMinutes()}`
        : new Date(date).getMinutes()) +
      ":" +
      (new Date(date).getSeconds() < 10
        ? `0${new Date(date).getSeconds()}`
        : new Date(date).getSeconds())
    );
  } else {
    return (
      (new Date(date).getHours() < 10
        ? `0${new Date(date).getHours()}`
        : new Date(date).getHours()) +
      ":" +
      (new Date(date).getMinutes() < 10
        ? `0${new Date(date).getMinutes()}`
        : new Date(date).getMinutes())
    );
  }
}

export function removeTime(
  date: string,
  separator?: string,
  format?: "dd/MM/yyyy" | "yyyy/MM/dd"
) {
  if (format == "yyyy/MM/dd") {
    return (
      new Date(date).getFullYear() +
      (separator || "-") +
      (new Date(date).getMonth() + 1 < 10
        ? `0${new Date(date).getMonth() + 1}`
        : new Date(date).getMonth() + 1) +
      (separator || "-") +
      (new Date(date).getDate() < 10
        ? `0${new Date(date).getDate()}`
        : new Date(date).getDate())
    );
  }
  return (
    (new Date(date).getDate() < 10
      ? `0${new Date(date).getDate()}`
      : new Date(date).getDate()) +
    (separator || "-") +
    (new Date(date).getMonth() + 1 < 10
      ? `0${new Date(date).getMonth() + 1}`
      : new Date(date).getMonth() + 1) +
    (separator || "-") +
    new Date(date).getFullYear()
  );
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
  return "None";
}

/** Return the day yearLength years before today
 *
 * @param yearLength
 * @returns
 */
export function getDateFromSetYear(yearLength: number) {
  const today = new Date();
  return new Date(
    today.getFullYear() - yearLength,
    today.getMonth(),
    today.getDate()
  );
}

export const differentDateReturnFormattedString = (
  firstDate: string,
  secondDate: string
) => {
  const date1 = dayjs(firstDate);
  const date2 = dayjs(secondDate);
  const diffInSeconds = date2.diff(date1, "seconds");

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds / 60) % 60);
  const seconds = Math.floor(diffInSeconds % 60);

  const hourString = hours == 0 ? "" : `${hours} hour${hours > 1 ? "s" : ""} `;
  const minuteString =
    minutes == 0 ? "" : `${minutes} minute${minutes > 1 ? "s" : ""} `;
  const secondString =
    seconds == 0 ? "" : `${seconds} second${seconds > 1 ? "s" : ""}`;

  return hourString + minuteString + secondString;
};

export const addDaysBaseOnReportInterval = (
  date: string | Date,
  interval: ReportInterval,
  formattedString?: string
) => {
  // console.log(date);

  var result = dayjs(date);
  switch (interval) {
    case ReportInterval.Day:
      result = result.add(1, "day");
      break;
    case ReportInterval.HalfDay:
      result = result.add(12, "hours");
      break;
    case ReportInterval.HalfHour:
      result = result.add(30, "minutes");
      break;
    case ReportInterval.Hour:
      result = result.add(1, "hour");
      break;
    case ReportInterval.Week:
      result = result.add(7, "days");
      break;
  }

  return result.format(formattedString ?? "YYYY-MM-DDTHH:mm:ss");
};

export function makeDivisibleByDivider(number: number, divider: number) {
  if (!number) return divider;
  const remainder = number % divider;
  const amountToAdd = (divider - remainder) % divider;
  const result = number + amountToAdd;
  return result;
}

export function formatTime(
  inputTime: string,
  withSeconds?: boolean,
  use24HourFormat?: boolean
) {
  let [hours, minutes, seconds] = inputTime.split(":");

  if (!withSeconds) {
    seconds = "";
  }

  if (!use24HourFormat) {
    let suffix = "AM";
    if (Number(hours) >= 12) {
      suffix = "PM";
      hours = (parseFloat(hours) % 12).toString();
      if (Number(hours) === 0) {
        hours = "12";
      }
    }
    return `${hours}:${minutes}${withSeconds ? `:${seconds ?? '00'}` : ""} ${suffix}`;
  }

  return `${hours}:${minutes}${withSeconds ? `:${seconds ?? '00'}` : ""}`;
}

export function getColorFromStatusName(statusName: string, light?: boolean) {
  if (light)
    return Object.values(ActiveStatusGroup).includes(
      statusName as ActiveStatusGroup
    )
      ? StatusColorLight.ACTIVE
      : Object.values(InactiveStatusGroup).includes(
        statusName as InactiveStatusGroup
      )
        ? StatusColorLight.INACTIVE
        : Object.values(IdleStatusGroup).includes(statusName as IdleStatusGroup)
          ? StatusColorLight.IDLE
          : Object.values(MiddleStatusGroup).includes(
            statusName as MiddleStatusGroup
          )
            ? StatusColorLight.MIDDLE
            : StatusColorLight.NONE;

  return Object.values(ActiveStatusGroup).includes(
    statusName as ActiveStatusGroup
  )
    ? StatusColor.ACTIVE
    : Object.values(InactiveStatusGroup).includes(
      statusName as InactiveStatusGroup
    )
      ? StatusColor.INACTIVE
      : Object.values(IdleStatusGroup).includes(statusName as IdleStatusGroup)
        ? StatusColor.IDLE
        : Object.values(MiddleStatusGroup).includes(statusName as MiddleStatusGroup)
          ? StatusColor.MIDDLE
          : StatusColor.NONE;
}

export function timeSince(date: Date) {

  var seconds = Math.floor(((new Date().getTime()) - date.getTime()) / 1000);

  var interval = seconds / 31536000;

  if (interval >= 1) {
    return Math.floor(interval) > 1 ? `${Math.floor(interval)} years ago` : `${Math.floor(interval)} year ago`;
  }
  interval = seconds / 2592000;
  if (interval >= 1) {
    return Math.floor(interval) > 1 ? `${Math.floor(interval)} months ago` : `${Math.floor(interval)} month ago`;
  }
  interval = seconds / 86400;
  if (interval >= 1) {
    return Math.floor(interval) > 1 ? `${Math.floor(interval)} days ago` : `${Math.floor(interval)} day ago`;
  }
  interval = seconds / 3600;
  if (interval >= 1) {
    return Math.floor(interval) > 1 ? `${Math.floor(interval)} hours ago` : `${Math.floor(interval)} hour ago`;
  }
  interval = seconds / 60;
  if (interval >= 1) {
    return Math.floor(interval) > 1 ? `${Math.floor(interval)} minutes ago` : `${Math.floor(interval)} minute ago`;
  }
  return Math.floor(interval) == 1 ? `${Math.floor(interval)} second ago` : `${Math.floor(interval)} seconds ago`;
}

export function randomInRange(start: number, end: number) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

/**
 * Check if errors has type TaskError
 * @param metadata Get metadata from response
 * @returns 
 */
export function hasErrorType(metadata: MetaData): metadata is { errors: TaskError[] } {
  return 'errors' in metadata;
}
