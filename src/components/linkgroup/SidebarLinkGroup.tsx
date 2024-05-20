import { useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./SidebarLinkGroup.module.scss";
import { useLocation, useNavigate } from "react-router-dom";

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  path?: string;
  links?: { label: string; link: string }[];
}

export function SidebarLinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  path,
  links,
}: LinksGroupProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <Text<"a">
      component="a"
      className={classes["link"]}
      key={link.label}
      onClick={(event) => {
        navigate(link.link);
        event.preventDefault();
      }}
    >
      {link.label}
    </Text>
  ));

  return (
    <Box>
      <UnstyledButton
        onClick={() => {
          setOpened((o) => !o)
          if (path) {
            navigate(path);
          }
        }}
        className={
          (hasLinks && links.some((e) => location.pathname === e.link)) ||
            location.pathname === path!
            ? `${classes["activeControl"]}`
            : `${classes["control"]}`
        }
      >
        <Group
          justify="space-between"
          gap={0}
        >
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon
              size={30}
              variant="transparent"
              className={
                (hasLinks && links.some((e) => location.pathname === e.link)) ||
                  location.pathname === path!
                  ? classes["activeIcon"]
                  : classes["icon"]
              }
            >
              <Icon style={{ width: rem(22), height: rem(22) }} />
            </ThemeIcon>
            <Box ml="sm">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes["chevron"]}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? "rotate(-90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? (
        <Collapse pl={"md"} in={opened}>
          {items}
        </Collapse>
      ) : null}
    </Box>
  );
}
