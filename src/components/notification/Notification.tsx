import { Avatar, Box, Center, Divider, Flex, Highlight, Indicator, Loader, ScrollArea, Tabs, Text, rem, } from "@mantine/core";
import { useState } from "react";
import { useUpdateNotificationStatus } from "../../hooks/useUpdateNotificationStatus";
import { NotificationStatus } from "../../models/CamAIEnum";
import { NotificationDetail } from "../../models/Notification";
import { timeSince } from "../../utils/helperFunction";
import classes from "./Notification.module.scss";

export const TabsHeader = ({
  active,
  number,
  text,
}: {
  text: string;
  number: number;
  active: boolean;
}) => {
  return (
    <Flex justify={"center"} align={"center"}>
      <Text
        fw={500}
        tt={"capitalize"}
        c={active ? "blue" : "dimmed"}
        size="md"
        mr={rem(8)}
      >
        {text}
      </Text>
      <Center
        className={active ? classes["tabnumber-active"] : classes["tabnumber"]}
        px={rem(7)}
        py={rem(2)}
      >
        <Text size="xs">{number}</Text>
      </Center>
    </Flex>
  );
};

const DetailCard = (props: {
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}) => {
  return (
    <Flex p={20} className={classes["detail-card"]}>
      <Indicator size={props?.isRead ? 0 : 15} color="pale-red.6" offset={7} processing >
        <Avatar
          size={"lg"}
          color="indigo"
          style={{
            cursor: "pointer",
            boxShadow: "0 0 3px 0 rgba(34, 34, 34, 1)",
            transition: "box-shadow 100ms",
          }}
          src={
            "https://cdn.dribbble.com/users/2552597/screenshots/15555751/media/6f80ecb0743b4d1d9e4ed388f3808026.png?resize=450x338&vertical=center"
          }
        />
      </Indicator>
      <Box ml={16}>
        <Highlight
          c={props?.isRead ? "dimmed" : undefined} size="md"
          highlight={[props?.title]}
          highlightStyles={{
            backgroundImage: props?.isRead ?
              "linear-gradient(45deg, #98D6E1, #BACBFB)" :
              "linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))",
            fontWeight: 700,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          lineClamp={2}
        >
          {props?.title}
        </Highlight>
        <Text c={props?.isRead ? "dimmed" : undefined} mb={5} size="sm">
          {props?.content}
        </Text>

        <Flex align={"center"}>
          <Text c="dimmed" fw={500} size="sm">
            {props?.time ? timeSince(new Date(props.time)) : "No Data"}
            {/* {dayjs(props?.time).format("HH:mm DD-MM-YYYY")} */}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export type NotificationProps = {
  notificationList: NotificationDetail[];
  refetchNotification: () => void;
  isNotificationListLoading: boolean;
};

const Notification = ({
  notificationList,
  refetchNotification,
  isNotificationListLoading,
}: NotificationProps) => {
  const { mutate: updateNotificationStatus } = useUpdateNotificationStatus();

  // const handleNavigate = ({ relatedEntityId, type }: NotificationDetail) => {
  //   switch (type) {
  //     case NotificationType.EdgeBoxInstallActivation:
  //     case NotificationType.EdgeBoxUnhealthy:
  //       navigate("/brand/shop");
  //   }
  // };

  const [activeTab, setActiveTab] = useState<string | null>("gallery");
  return (
    <ScrollArea w={rem(500)} h={680}>
      <Flex
        justify={"space-between"}
        align={"center"}
        mx={rem(16)}
        my={rem(20)}
      >
        <Text fw={500} size="xl">
          Notification
        </Text>
        <Center>
          <Text c="#adb5bd" size="md" className={classes["anchor"]}>
            Mark all as read
          </Text>
        </Center>
      </Flex>
      <Divider />
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        styles={{
          tabLabel: {
            padding: rem(4),
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="gallery">
            <TabsHeader
              active={activeTab == "gallery"}
              number={
                notificationList.filter(
                  (n) => n.status == NotificationStatus.Unread
                ).length
              }
              text="All notification"
            />
          </Tabs.Tab>
          {/* <Tabs.Tab value="messages">
            <TabsHeader
              active={activeTab == "messages"}
              number={12}
              text="sad"
            />
          </Tabs.Tab>
          <Tabs.Tab value="settings">
            <TabsHeader
              active={activeTab == "settings"}
              number={12}
              text="sad"
            />
          </Tabs.Tab> */}
        </Tabs.List>

        <Tabs.Panel value="gallery">
          {isNotificationListLoading ? (
            <Loader />
          ) : (
            <>
              {notificationList?.map((item) => (
                <Box
                  key={item?.id}
                  onClick={() => {
                    updateNotificationStatus(
                      {
                        notificationId: item?.id,
                        status: NotificationStatus.Read,
                      },
                      {
                        onSuccess() {
                          refetchNotification();
                        },
                      }
                    );
                  }}
                >
                  <DetailCard
                    content={item?.content}
                    time={item?.createdDate}
                    title={item?.title}
                    isRead={item?.status == NotificationStatus.Read}
                  />
                </Box>
              ))}
            </>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
      </Tabs>
    </ScrollArea>
  );
};

export default Notification;
