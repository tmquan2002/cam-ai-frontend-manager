import {
  Box,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import { IconCaretRight, IconTrendingUp } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import classes from "./ShopStreamPage.module.scss";
import { useEffect, useId, useState } from "react";
//@ts-ignore
import JSMpeg from "@cycjimmy/jsmpeg-player";

type RenderContentType = {
  key: number;
  content: string;
};

const list: RenderContentType[] = [
  {
    key: 1,
    content: "Lorem ipsum dolor ",
  },
  {
    key: 2,
    content: "Lorem ipsum dolor ",
  },
  {
    key: 3,
    content: "Lorem ipsum dolor ",
  },
  {
    key: 4,
    content: "Lorem ipsum dolor ",
  },
  {
    key: 5,
    content: "Lorem ipsum dolor ",
  },
  {
    key: 6,
    content: "Lorem ipsum dolor ",
  },
  {
    key: 7,
    content: "Lorem ipsum dolor ",
  },
];

const ShopStreamPage = () => {
  const navigate = useNavigate();
  const videoWrapperID = useId();
  const [videoPLayer, setVideoPLayer] = useState<any>();
  useEffect(() => {
    const video = new JSMpeg.VideoElement(
      `#${CSS.escape(videoWrapperID)}`,
      "wss://stream.camai.io.vn/8001/N3ACW2LWT2SQETLQ6O8B",
      { autoplay: true }
    );
    setVideoPLayer(video);
  }, []);

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const renderContent = ({ key, content }: RenderContentType) => {
    return (
      <Card
        withBorder
        padding="lg"
        key={key}
        className={classes.main_container}
        w={rem(400)}
        p="md"
        onClick={() => navigate(`/shop/incident/${key}`)}
      >
        <Group justify="space-between" align="center" mb={"md"}>
          <Text fw={500}>{content}</Text>
          <IconCaretRight
            style={{ width: "20px", height: "20px" }}
            color={computedColorScheme == "dark" ? "#5787db" : "#39588f"}
          />
        </Group>
        <Card.Section className={classes.card_footer}>
          <div>
            <Text size="xs" c="dimmed">
              Total
            </Text>
            <Text fw={500} size="sm">
              20 people
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Variation
            </Text>
            <Flex align={"center"}>
              <Text fw={500} size="sm">
                12
              </Text>
              <IconTrendingUp
                style={{ width: "30%", height: "30%" }}
                color={computedColorScheme == "dark" ? "#45b445" : "green"}
              />
            </Flex>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Time
            </Text>
            <Text fw={500} size="sm">
              Jan, 20 2023
            </Text>
          </div>
        </Card.Section>
      </Card>
    );
  };

  return (
    <Box pb={rem(40)}>
      <Text
        size="lg"
        fw={"bold"}
        fz={25}
        c={"light-blue.4"}
        ml={rem(40)}
        my={rem(20)}
      >
        STREAM
      </Text>

      <Flex>
        <Box flex={1}>
          <Paper mx={rem(40)} shadow="xs" px={rem(32)} py={rem(20)}>
            <Text fw={500} size={rem(18)} mb={rem(20)}>
              Live Footage
            </Text>
            <Divider color="#acacac" mb={rem(20)} />
            <Center mb={rem(20)}>
              <Box w={rem(980)} h={rem(540)} id={videoWrapperID}></Box>
              {/* <ReactPlayer url="wss://stream.camai.io.vn/8001/55ZHRKFLO0LKJ3J4VBC5" /> */}
            </Center>
          </Paper>
        </Box>

        <ScrollArea h={"80vh"} className={classes.scroll_area} mr={rem(40)}>
          <Stack gap={"lg"}>{list.map((item) => renderContent(item))}</Stack>
        </ScrollArea>
      </Flex>
    </Box>
  );
};

export default ShopStreamPage;
