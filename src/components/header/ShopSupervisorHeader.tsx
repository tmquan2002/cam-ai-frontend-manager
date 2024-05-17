import { useSession } from "../../context/AuthContext";
import { useNotification } from "../../hooks/useNotification";
import { useGetNotificationList } from "../../hooks/useGetNotificationList";
import {
  ActionIcon,
  Flex,
  Group,
  Indicator,
  Popover,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { NotificationStatus, Role } from "../../models/CamAIEnum";
import { MdLogout } from "react-icons/md";
import { IconUser } from "@tabler/icons-react";
import Notification from "../notification/Notification";
import { useEffect } from "react";
import { ReadyState } from "react-use-websocket";
import { notifications } from "@mantine/notifications";
import _ from "lodash";
import { useGetProfile } from "../../hooks/useGetProfile";
import { IconBell } from "@tabler/icons-react";

const convertRoleString = (role: Role | null | undefined): string => {
  switch (role) {
    case Role.Admin:
      return "Admin";
    case Role.BrandManager:
      return "Brand manager";
    case Role.ShopHeadSupervisor:
      return "Head supervisor";
    case Role.ShopManager:
      return "Shop manager";
    case Role.ShopSupervisor:
      return "Shop supervisor";
    case Role.SystemHandler:
      return "System handler";
    default:
      return "";
  }
};

const ShopSupervisorHeader = () => {
  const session = useSession();
  const { data: profile } = useGetProfile();
  const { lastJsonMessage, readyState } = useNotification();
  const {
    data: notificationList,
    isLoading: isGetNotificationListLoading,
    refetch: refetchNotificationList,
  } = useGetNotificationList({ size: 20 });
  useEffect(() => {
    if (readyState == ReadyState.OPEN && !_.isEmpty(lastJsonMessage)) {
      notifications.show({
        title: lastJsonMessage?.title,
        message: lastJsonMessage?.content,
      });
    }
  }, [readyState, lastJsonMessage]);
  const isNotificationAllRead: boolean =
    notificationList?.isValuesEmpty ||
    notificationList?.values == undefined ||
    notificationList?.values?.filter(
      (n) => n.status == NotificationStatus.Unread
    ).length > 0;
  return (
    <Flex justify="space-between" px={rem(32)} align={"center"} h={"100%"}>
      <Group>
        <Text fw={600}>CAMAI</Text>
      </Group>
      <Group gap={6}>
        <Group
          gap={8}
          py={rem(4)}
          px={rem(8)}
          pr={rem(12)}
          style={{
            border: "1px solid #ccc",
            borderRadius: rem(6),
            cursor: "default",
          }}
        >
          <IconUser style={{ width: rem(20), height: rem(20) }} stroke={1.5} />

          <Stack gap={2}>
            <Text c={"rgb(17, 24, 39)"} size={rem(14)} fw={500} style={{}}>
              {profile?.name}
            </Text>
            <Text c={"rgb(100, 116, 139)"} size={rem(12)} fw={400}>
              {convertRoleString(profile?.role)}
            </Text>
          </Stack>
        </Group>

        <Popover position="bottom-end" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon
              size={rem(36)}
              variant="transparent"
              aria-label="Notifications"
              c={"#000"}
            >
              <Indicator
                size={isNotificationAllRead ? 5 : 0}
                color="pale-red.6"
              >
                <IconBell style={{ width: 20, height: 20 }} />
              </Indicator>
            </ActionIcon>
          </Popover.Target>

          <Popover.Dropdown p={0}>
            <Notification
              notificationList={notificationList?.values ?? []}
              isNotificationListLoading={isGetNotificationListLoading}
              refetchNotification={refetchNotificationList}
            />
          </Popover.Dropdown>
        </Popover>

        <ActionIcon
          variant="transparent"
          size={rem(36)}
          aria-label="Logout"
          c={"#000"}
          onClick={() => {
            session?.signOut();
          }}
        >
          <MdLogout style={{ width: 20, height: 20 }} />
        </ActionIcon>
      </Group>
    </Flex>
  );
};

export default ShopSupervisorHeader;
