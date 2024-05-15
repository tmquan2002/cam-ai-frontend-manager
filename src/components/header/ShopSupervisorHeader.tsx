import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/AuthContext";
import { useNotification } from "../../hooks/useNotification";
import { useGetNotificationList } from "../../hooks/useGetNotificationList";
import {
  ActionIcon,
  Flex,
  Group,
  Indicator,
  Popover,
  Text,
  Tooltip,
  rem,
} from "@mantine/core";
import { NotificationStatus } from "../../models/CamAIEnum";
import { MdLogout, MdNotifications } from "react-icons/md";
import { IconUser } from "@tabler/icons-react";
import Notification from "../notification/Notification";
import { useEffect } from "react";
import { ReadyState } from "react-use-websocket";
import { notifications } from "@mantine/notifications";
import _ from "lodash";

const ShopSupervisorHeader = () => {
  const session = useSession();
  const navigate = useNavigate();
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
      <Group gap={5}>
        <Popover position="bottom-end" withArrow shadow="md">
          <Tooltip label="Notification" withArrow>
            <Popover.Target>
              <Indicator
                size={isNotificationAllRead ? 5 : 0}
                color="pale-red.6"
              >
                <ActionIcon variant="default" aria-label="Notifications">
                  <MdNotifications style={{ width: 18, height: 18 }} />
                </ActionIcon>
              </Indicator>
            </Popover.Target>
          </Tooltip>

          <Popover.Dropdown p={0}>
            <Notification
              notificationList={notificationList?.values ?? []}
              isNotificationListLoading={isGetNotificationListLoading}
              refetchNotification={refetchNotificationList}
            />
          </Popover.Dropdown>
        </Popover>

        <Tooltip label="Profile" withArrow>
          <ActionIcon
            variant="default"
            aria-label="Profile"
            onClick={() => navigate("/shop/profile")}
          >
            <IconUser style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Logout" withArrow>
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

export default ShopSupervisorHeader;
