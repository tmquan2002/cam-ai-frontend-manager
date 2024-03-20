import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconFileAnalytics,
} from "@tabler/icons-react";
import { SidebarLinksGroup } from "../linkgroup/SidebarLinkGroup";
import { ScrollArea } from "@mantine/core";
import classes from "./Sidebar.module.scss";

const mockdata = [
  { label: "Dashboard", icon: IconGauge, path: "/brand" },
  {
    label: "Brand",
    icon: IconNotes,
    initiallyOpened: true,
    links: [{ label: "Overview", link: "/" }],
  },
  {
    label: "Account",
    icon: IconNotes,
    links: [
      { label: "Shop manager ", link: "/brand/account" },
      { label: "Create manager ", link: "/brand/create/manager" },
      { label: "Employee ", link: "/brand/employee" },
    ],
  },
  {
    label: "Your Shop",
    icon: IconCalendarStats,
    links: [
      { label: "Shop list ", link: "/brand/shop" },
      { label: "Add shop ", link: "/brand/create/shop" },
    ],
  },
  {
    label: "Report",
    icon: IconFileAnalytics,
    links: [{ label: "Incidents", link: "/brand/incident" }],
  },
];

export function BrandNavbar() {
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
