import {
  Box,
  Card,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconCaretRight, IconTrendingUp } from "@tabler/icons-react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import classes from "./ShopReportPage.module.scss";

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

const ShopReportPage = () => {
  const navigate = useNavigate();
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
        <Group
          justify="space-between"
          align="center"
          mb={"md"}
        >
          <Text fw={500}>{content}</Text>
          <ThemeIcon variant="white">
            <IconCaretRight style={{ width: "80%", height: "80%" }} />
          </ThemeIcon>
        </Group>
        <Card.Section className={classes.card_footer}>
          <div>
            <Text
              size="xs"
              color="dimmed"
            >
              Total
            </Text>
            <Text
              fw={500}
              size="sm"
            >
              20 people
            </Text>
          </div>
          <div>
            <Text
              size="xs"
              color="dimmed"
            >
              Variation
            </Text>
            <Flex align={"center"}>
              <Text
                fw={500}
                size="sm"
              >
                12
              </Text>
              <ThemeIcon
                variant="white"
                color="green"
              >
                <IconTrendingUp style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
            </Flex>
          </div>
          <div>
            <Text
              size="xs"
              color="dimmed"
            >
              Time
            </Text>
            <Text
              fw={500}
              size="sm"
            >
              Jan, 20 2023
            </Text>
          </div>
        </Card.Section>
      </Card>
    );
  };

  // const renderJson = (shops: ChartReportData) => {

  // }

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
        REPORTS
      </Text>

      <Flex>
        <Box flex={1}>
          <Paper
            mx={rem(40)}
            shadow="xs"
            px={rem(32)}
            py={rem(20)}
          >
            <Text
              fw={500}
              size={rem(18)}
              mb={rem(20)}
            >
              Live Footage
            </Text>
            <Divider
              color="#acacac"
              mb={rem(20)}
            />
            <Box mb={rem(20)}>
              <ReactPlayer url="https://www.youtube.com/watch?v=TSwPIYczhPc&t=1s" />
            </Box>
          </Paper>
        </Box>

        <ScrollArea
          h={"80vh"}
          className={classes.scroll_area}
          mr={rem(40)}
        >
          <Stack gap={"lg"}>{list.map((item) => renderContent(item))}</Stack>
        </ScrollArea>
      </Flex>
    </Box>
  );
};

export default ShopReportPage;
