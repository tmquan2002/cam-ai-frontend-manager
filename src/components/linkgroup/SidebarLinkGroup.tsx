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
  const location = useLocation()
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <Text<"a">
      component="a"
      className={classes["link"]}
      // href={link.link}
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
        onClick={() => setOpened((o) => !o)}
        className={(hasLinks && links.some(e => location.pathname === e.link)) || location.pathname === path! ? `${classes["activeControl"]}` : `${classes["control"]}`}
      >
        <Group
          onClick={() => {
            if (path) {
              navigate(path);
            }
          }}
          justify="space-between"
          gap={0}
        >
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon
              size={30}
            >
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
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
        <Collapse
          pl={"md"}
          in={opened}
        >
          {items}
        </Collapse>
      ) : null}
    </Box>
  );
}
