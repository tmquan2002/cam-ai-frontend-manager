import {
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconLock,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { SidebarLinksGroup } from "../linkgroup/SidebarLinkGroup";
import { ScrollArea } from "@mantine/core";
import classes from "./Sidebar.module.scss";
import { IconVideo } from "@tabler/icons-react";

const mockdata = [
  { label: "Dashboard", icon: IconGauge, path: "/shop" },

  {
    label: "Detail",
    icon: IconPresentationAnalytics,
    path: "/shop/detail",
  },
  {
    label: "Incident",
    icon: IconExclamationCircle,
    path: "/shop/incident",
  },
  {
    label: "Live",
    icon: IconVideo,
    path: "/shop/stream",
  },
  {
    label: "Report",
    icon: IconFileAnalytics,
    links: [
      { label: "Customer", link: "/shop/report/customer" },
      { label: "Incident", link: "/shop/report/incident" },
      { label: "Interaction", link: "/shop/report/interaction" },
    ],
  },
  {
    label: "Employee",
    icon: IconLock,
    links: [
      { label: "Create", link: "/shop/employee/create" },
      { label: "Employee", link: "/shop/employee" },
    ],
  },
];

export function ShopNavbar() {
  const links = mockdata.map((item) => (
    <SidebarLinksGroup {...item} key={item.label} />
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
