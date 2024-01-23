import { ActionIcon, Box, Flex, Popover, rem } from "@mantine/core";
import { IconLogout, IconNotification, IconUser } from "@tabler/icons-react";
import { useSession } from "../../context/AuthContext";
import Notification from "../notification/Notification";
import { useNavigate } from "react-router-dom";

const BrandHeader = () => {
  const session = useSession();
  const navigate = useNavigate();
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
          color="blue"
          m={0}
          onClick={() => navigate("/brand/profile")}
        >
          <IconUser
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
          />
        </ActionIcon>

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

export default BrandHeader;
