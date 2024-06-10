import { MantineColorsTuple } from "@mantine/core";
export enum CommonConstant {
  IS_ALREADY_FETCHING_ACCESS = "isAlreadyFetchingAccessToken",
  SESSION = "session",
  USER_ACCESS_TOKEN = "user_access_token",
  USER_REFRESH_TOKEN = "user_refresh_token",
  TASK_ID = "task_id"
}

//Tips: Install "Colorize" extention and Add Typescript file in settings.json for easier to see color
export const light_yellow: MantineColorsTuple = [
  "#fdfce5",
  "#f8f6d3",
  "#f0ecaa",
  "#e7e17c",
  "#e0d957",
  "#dbd33e",
  "#d9d02f",
  "#c0b820",
  "#aaa316",
  "#938c03",
];

export const light_blue: MantineColorsTuple = [
  "#eef3ff",
  "#dce4f5",
  "#b9c7e2",
  "#94a8d0",
  "#748dc1",
  "#5f7cb8",
  "#5474b4",
  "#44639f",
  "#39588f",
  "#2d4b81",
];

export const shading: MantineColorsTuple = [
  "#f5f5f5",
  "#e7e7e7",
  "#cdcdcd",
  "#b2b2b2",
  "#9a9a9a",
  "#8b8b8b",
  "#848484",
  "#717171",
  "#656565",
  "#575757",
];

export const pale_red: MantineColorsTuple = [
  "#ffeaf3",
  "#fdd4e1",
  "#f4a7bf",
  "#ec779c",
  "#e64f7e",
  "#e3356b",
  "#e22762",
  "#c91a52",
  "#b41149",
  "#9f003e",
];

export const dark_background = "#242424";
export const dark_background_container = "#1f1f1f";

export enum IMAGE_CONSTANT {
  NO_IMAGE = "https://cdn.dribbble.com/users/55871/screenshots/2158022/media/8f2a4a2c9126a9f265fb9e1023b1698a.jpg?resize=450x338&vertical=center",
  NO_DATA = "https://cdn.dribbble.com/users/256646/screenshots/17751098/media/768417cc4f382d6171053ad620bc3c3b.png?resize=1000x750&vertical=center",
}

export enum NotificationColorPalette {
  IN_PROGRESS = "#9B59B6",
  DRAFT = "#34495E",
  REPORT_EXPENSES = "#54A0FF",
  UP_COMING = "#30CB83",
  UNAPPROVED = "#F1C40F",
  SEND_BACK = "#B33771",
  ALERT_MESSAGE = "#E74C3C",
  WARNING = "#F39C12",
  DEVIATIONS = "#D35400",
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export const DEFAULT_PAGE_SIZE = '20'
export const PAGE_SIZE_SELECT = ['10', '15', '20']
export type Color = RGB | RGBA | HEX;
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
export const EMAIL_REGEX = /^\S+@(\S+\.)+\S{2,4}$/;
export const URL_REGEX = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
export const POLLING_INTERVAL = 1000