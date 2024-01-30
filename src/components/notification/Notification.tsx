import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Highlight,
  ScrollArea,
  Tabs,
  Text,
  // ThemeIcon,
  rem,
} from "@mantine/core";
import classes from "./Notification.module.scss";
import { useEffect, useState } from "react";
import { getMessagingToken, onMessageListener } from "../../utils/firebase";

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
    <Flex
      justify={"center"}
      align={"center"}
    >
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
const DetailCard = () => {
  return (
    <Flex
      p={20}
      className={classes["detail-card"]}
    >
      <Avatar
        mr={16}
        color="indigo"
        style={{
          cursor: "pointer",
          boxShadow: "0 0 3px 0 rgba(34, 34, 34, 1)",
          transition: "box-shadow 100ms",
        }}
        src={
          "https://cdn.dribbble.com/userupload/12227219/file/original-de74628c0a89c1358a54b6ed6e83ac79.png?crop=0x0-1600x1200&resize=400x300&vertical=center"
        }
      />
      <Box>
        <Highlight
          highlight={["Lorem ipsum", "dicta"]}
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
          voluptas asperiores provident necessitatibus architecto ullam minima
          odio blanditiis tempore pariatur dicta eveniet alias, porro, qui
          ipsum! Aut esse unde eveniet.
        </Highlight>

        <Flex align={"center"}>
          <Text
            c="dimmed"
            fw={500}
            size="sm"
          >
            1 minutes ago
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

const Notification = () => {
  useEffect(() => {
    getMessagingToken();
  }, []);
  useEffect(() => {
    onMessageListener().then((data) => {
      console.log("Receive foreground: ", data);
    });
  });

  const [activeTab, setActiveTab] = useState<string | null>("gallery");
  return (
    <ScrollArea
      w={rem(500)}
      h={680}
    >
      <Flex
        justify={"space-between"}
        align={"center"}
        mx={rem(16)}
        my={rem(20)}
      >
        <Text
          fw={500}
          size="xl"
        >
          Notification
        </Text>
        <Center>
          <Text
            c="#adb5bd"
            size="md"
            className={classes["anchor"]}
          >
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
              text="sad"
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
          {[1, 2, 3, 4, 5].map((item) => (
            <Box key={item}>
              <DetailCard />
              <Divider />
            </Box>
          ))}
          <DetailCard />
        </Tabs.Panel>

        <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
      </Tabs>
    </ScrollArea>
  );
};

export default Notification;
