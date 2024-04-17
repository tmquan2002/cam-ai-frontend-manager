import {
  IconNotes,
  IconGauge,
  IconFileAnalytics,
  IconRouter,
  IconUser,
  IconMan,
} from "@tabler/icons-react";
import { SidebarLinksGroup } from "../linkgroup/SidebarLinkGroup";
import { ScrollArea } from "@mantine/core";
import classes from "./Sidebar.module.scss";
import { IconExclamationCircle } from "@tabler/icons-react";

const mockdata = [
  { label: "Dashboard", icon: IconGauge, path: "/brand" },
  {
    label: "Your Brand",
    icon: IconNotes,
    initiallyOpened: true,
    links: [{ label: "Overview", link: "/" }],
  },
  {
    label: "Shops and Managers",
    icon: IconUser,
    links: [
      { label: "Your Shops", link: "/brand/shop" },
      { label: "Shop Managers", link: "/brand/account" },
    ],
  }, {
    label: "Employees",
    icon: IconMan,
    path: "/brand/employee" ,
  },
  {
    label: "Edge Boxes",
    icon: IconRouter,
    path: "/brand/edgeBox",
  },
  {
    label: "Incidents & Interactions",
    icon: IconExclamationCircle,
    links: [
      {
        label: "Incident list",
        link: "/brand/incident",
      },
      {
        label: "Interaction list",
        link: "/brand/interaction",
      },
    ],
  },
  {
    label: "Reports",
    icon: IconFileAnalytics,
    links: [
      { label: "Customer", link: "/brand/report/customer" },
      { label: "Incident", link: "/brand/report/incident" },
      { label: "Interaction", link: "/brand/report/interaction" },
    ],
  },
];

export function BrandNavbar() {
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
