import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Highlight,
  Loader,
  ScrollArea,
  Tabs,
  Text,
  // ThemeIcon,
  rem,
} from "@mantine/core";
import classes from "./Notification.module.scss";
import {  useState } from "react";
import { useGetNotificationList } from "../../hooks/useGetNotificationList";
import dayjs from "dayjs";
import { NotificationStatus } from "../../models/CamAIEnum";
import { useUpdateNotificationStatus } from "../../hooks/useUpdateNotificationStatus";

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
    <Flex
      p={20}
      className={
        props?.isRead ? classes["detail-card"] : classes["detail-card-active"]
      }
    >
      <Avatar
        mr={16}
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
      <Box>
        <Highlight
          highlight={[props?.title]}
          highlightStyles={{
            backgroundImage:
              "linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))",
            fontWeight: 700,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          lineClamp={2}
          mb={10}
        >
          {`${props?.title} | ${props.content}`}
        </Highlight>

        <Flex align={"center"}>
          <Text c="dimmed" fw={500} size="sm">
            {dayjs(props?.time).format("HH:mm DD-MM-YYYY")}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

const Notification = () => {
  const { data, isLoading, refetch } = useGetNotificationList();

  const { mutate: updateNotificationStatus } = useUpdateNotificationStatus();

 
  

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
              number={12}
              text="All"
            />
          </Tabs.Tab>
          <Tabs.Tab value="messages">
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
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="gallery">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {data?.values?.map((item) => (
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
                          refetch();
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
