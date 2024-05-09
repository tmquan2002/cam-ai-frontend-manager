import {
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconExclamationCircle,
  IconMan,
  IconCalendarTime,
} from "@tabler/icons-react";
import { SidebarLinksGroup } from "../linkgroup/SidebarLinkGroup";
import { ScrollArea } from "@mantine/core";
import classes from "./Sidebar.module.scss";

const mockdata = [
  { label: "Dashboard", icon: IconGauge, path: "/shop" },
  { label: "In charge", icon: IconCalendarTime, path: "/shop/calendar" },

  {
    label: "Shop detail",
    icon: IconPresentationAnalytics,
    path: "/shop/detail",
  },
  {
    label: "Employees",
    icon: IconMan,
    path: "/shop/employee",
  },
  {
    label: "Incidents & Interactions",
    icon: IconExclamationCircle,
    links: [
      {
        label: "Incident",
        link: "/shop/incident",
      },
      {
        label: "Interaction",
        link: "/shop/interaction",
      },
    ],
  },
  {
    label: "Reports",
    icon: IconFileAnalytics,
    links: [
      { label: "Incident", link: "/shop/report/incident" },
      { label: "Interaction", link: "/shop/report/interaction" },
    ],
  },
];

const links = mockdata.map((item) => (
  <SidebarLinksGroup {...item} key={item.label} />
));
export function ShopNavbar() {
  return (
    <nav className={classes["navbar"]}>
      <ScrollArea className={classes["links"]}>
        <div className={classes["linksInner"]}>{links}</div>
      </ScrollArea>

      {/* <div className={classes["footer"]}><UserButton /></div> */}
    </nav>
  );
}
