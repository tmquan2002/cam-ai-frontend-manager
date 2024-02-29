import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
} from "@tabler/icons-react";
import { SidebarLinksGroup } from "../linkgroup/SidebarLinkGroup";
import { ScrollArea } from "@mantine/core";
import classes from "./Sidebar.module.scss";

const mockdata = [
  { label: "Dashboard", icon: IconGauge, path: "/brand" },
  {
    label: "Brand News",
    icon: IconNotes,
    initiallyOpened: true,
    links: [{ label: "Overview", link: "/" }],
  },
  {
    label: "Your Shop",
    icon: IconCalendarStats,
    links: [{ label: "Add shop ", link: "/brand/create/shop" }],
  },
  { label: "Detail", icon: IconPresentationAnalytics, path: "detail" },
  { label: "Report", icon: IconFileAnalytics, path: "report" },
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
