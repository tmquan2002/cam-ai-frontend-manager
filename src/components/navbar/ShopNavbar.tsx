import {
  IconNotes,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
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
    links: [{ label: "Overview", link: "/shop/overview" }],
  },

  {
    label: "Detail",
    icon: IconPresentationAnalytics,
    links: [
      { label: "Overview", link: "/shop/detail" },
      { label: "Employee", link: "/shop/employee" },
    ],
  },
  {
    label: "Report",
    icon: IconFileAnalytics,
    links: [
      { label: "Incident", link: "/shop/incident" },
      { label: "Live", link: "/shop/report" },
    ],
  },
  {
    label: "Employee",
    icon: IconLock,
    links: [{ label: "Create", link: "/shop/employee/create" }],
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
