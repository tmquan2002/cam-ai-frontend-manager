import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from "@tabler/icons-react";
import { NavbarLinksGroup } from "../linkgroup/NavbarLinkGroup";
import { ScrollArea } from "@mantine/core";
import classes from "./ShopNavbar.module.scss";

const mockdata = [
  { label: "Dashboard", icon: IconGauge, path: "/brand" },
  {
    label: "Tin mới Brand",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: "Overview", link: "/" },
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
    label: "Security",
    icon: IconLock,
    links: [
      { label: "Enable 2FA", link: "/" },
      { label: "Change password", link: "/" },
      { label: "Recovery codes", link: "/" },
    ],
  },
];

export function BrandNavbar() {
  const links = mockdata.map((item) => (
    <NavbarLinksGroup
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