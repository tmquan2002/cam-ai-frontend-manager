import { ActionIcon, Box, Flex, Popover, rem } from "@mantine/core";
import { IconLogout, IconNotification } from "@tabler/icons-react";
import { useSession } from "../../context/AuthContext";
import Notification from "../notification/Notification";

const ShopHeader = () => {
  const session = useSession();
  return (
    <Flex
      justify="space-between"
      px={rem(32)}
      align={"center"}
      h={"100%"}
    >
      <p>Logo</p>
      <Box>
        <Popover
          position="bottom-end"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <ActionIcon
              variant="default"
              aria-label="Settings"
            >
              <IconNotification
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown p={0}>
            <Notification />
          </Popover.Dropdown>
        </Popover>

        <ActionIcon
          variant="outline"
          aria-label="Settings"
          color="red"
          m={0}
          onClick={() => {
            session?.signOut();
          }}
        >
          <IconLogout
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Box>
    </Flex>
  );
};

export default ShopHeader;
