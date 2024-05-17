import { ScrollArea } from "@mantine/core";
import {
  IconExclamationCircle,
  IconFileAnalytics,
  IconHome,
  IconMan,
  IconNotes,
  IconRouter,
} from "@tabler/icons-react";
import { SidebarLinksGroup } from "../linkgroup/SidebarLinkGroup";
import classes from "./Sidebar.module.scss";

const mockdata = [
  {
    label: "Your Brand",
    icon: IconNotes,
    path: "/brand",
  },
  {
    label: "Shops",
    icon: IconHome,
    links: [
      { label: "Shop details", link: "/brand/shop" },
      { label: "Shop managers", link: "/brand/account" },
    ],
  },
  {
    label: "Employees",
    icon: IconMan,
    path: "/brand/employee",
  },
  {
    label: "Edge Boxes",
    icon: IconRouter,
    path: "/brand/edgeBox",
  },
  {
    label: "Incidents",
    icon: IconExclamationCircle,

    path: "/brand/incident",
  },
  {
    label: "Reports",
    icon: IconFileAnalytics,
    links: [
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
