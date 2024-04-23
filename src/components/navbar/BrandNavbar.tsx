import { ScrollArea } from "@mantine/core";
import { IconExclamationCircle, IconFileAnalytics, IconGauge, IconNotes, IconRouter, IconUser } from "@tabler/icons-react";
import { AiFillShop } from "react-icons/ai";
import { SidebarLinksGroup } from "../linkgroup/SidebarLinkGroup";
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
    icon: IconUser,
    links: [
      { label: "Shop Manager ", link: "/brand/account" },
      { label: "Employee ", link: "/brand/employee" },
    ],
  },
  {
    label: "Shop",
    icon: AiFillShop,
    path: "/brand/shop",
  },
  {
    label: "EdgeBox",
    icon: IconRouter,
    path: "/brand/edgeBox",
  },
  {
    label: "Incident & Interaction",
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
    label: "Report",
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
