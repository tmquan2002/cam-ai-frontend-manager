import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from "@tabler/icons-react";
import { SidebarLinksGroup } from "../linkgroup/SidebarLinkGroup";
import { ScrollArea } from "@mantine/core";
import classes from "./Sidebar.module.scss";

const mockdata = [
  { label: "Dashboard", icon: IconGauge, path: "/shop" },
  {
    label: "Statictis",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: "Overview", link: "/shop/overview" },
      { label: "Forecasts", link: "/" },
      { label: "Outlook", link: "/" },
      { label: "Real time", link: "/" },
    ],
  },
  {
    label: "Your brand",
    icon: IconCalendarStats,
    links: [
      { label: "Detail", link: "/shop/brand/detail" },
      { label: "Previous releases", link: "/" },
      { label: "Releases schedule", link: "/" },
    ],
  },
  { label: "Detail", icon: IconPresentationAnalytics, path: "detail" },
  { label: "Report", icon: IconFileAnalytics, path: "report" },
  { label: "Settings", icon: IconAdjustments },
  {
    label: "Employee",
    icon: IconLock,
    links: [
      { label: "Create", link: "/shop/employee/create" },
      { label: "Change password", link: "/empl" },
      { label: "Recovery codes", link: "/" },
    ],
  },
];

export function ShopNavbar() {
  const links = mockdata.map((item) => (
    <SidebarLinksGroup
      {...item}
      key={item.label}
    />
  ));

  return (
    <nav className={classes["navbar"]}>
      <ScrollArea className={classes["links"]}>
        <div className={classes["linksInner"]}>{links}</div>
      </ScrollArea>

      {/* <div className={classes["footer"]}><UserButton /></div> */}
    </nav>
  );
}
