import {
  ActionIcon,
  Burger,
  Flex,
  Group,
  Indicator,
  Popover,
  Tooltip,
  rem,
} from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { MdLogout, MdNotifications } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/AuthContext";
import Notification from "../notification/Notification";
import LightDarkSwitch from "../lightdarkswitch/LightDarkSwitch";

interface BurgerProps {
  mobileOpened: boolean;
  toggleMobile: () => void;
  desktopOpened: boolean;
  toggleDesktop: () => void;
}

const BrandHeader = ({ toggleMobile, toggleDesktop }: BurgerProps) => {
  const session = useSession();
  const navigate = useNavigate();
  return (
    <Flex
      justify="space-between"
      px={rem(32)}
      align={"center"}
      h={"100%"}
    >
      <Group>
        <Burger
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
        />
        <Burger
          onClick={toggleDesktop}
          visibleFrom="sm"
          size="sm"
        />
        <b>CAMAI</b>
      </Group>
      <Group gap={5}>
        <LightDarkSwitch size="md" />

        <Popover
          position="bottom-end"
          withArrow
          shadow="md"
        >
          <Tooltip
            label="Notification"
            withArrow
          >
            <Popover.Target>
              <Indicator
                size={5}
                color="pale-red.6"
              >
                <ActionIcon
                  variant="default"
                  aria-label="Notifications"
                >
                  <MdNotifications style={{ width: 18, height: 18 }} />
                </ActionIcon>
              </Indicator>
            </Popover.Target>
          </Tooltip>

          <Popover.Dropdown p={0}>
            <Notification />
          </Popover.Dropdown>
        </Popover>

        <Tooltip
          label="Profile"
          withArrow
        >
          <ActionIcon
            variant="default"
            aria-label="Profile"
            onClick={() => navigate("/brand/profile")}
          >
            <IconUser
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Tooltip>

        <Tooltip
          label="Logout"
          withArrow
        >
          <ActionIcon
            variant="default"
            aria-label="Logout"
            onClick={() => {
              session?.signOut();
            }}
          >
            <MdLogout style={{ width: 18, height: 18 }} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Flex>
  );
};

export default BrandHeader;
