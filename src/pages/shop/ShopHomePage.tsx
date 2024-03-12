import { LineChart } from "@mantine/charts";
import {
  Box, Card, Flex, Grid, Group,
  Text, ThemeIcon, rem, useComputedColorScheme
} from "@mantine/core";
import { IconList } from "@tabler/icons-react";
import * as _ from "lodash";
import { useReports } from "../../hooks/useReport";
import { getDateTime, returnWebsocketConnection } from "../../utils/helperFunction";
import classes from "./ShopHomePage.module.scss";

export type TitleAndNumberCard = {
  title: string;
  number: number;
  icon: React.FC;
  type: "blue" | "green" | "red" | "yellow";
};

const TitleAndNumberCard = () => {
  return (
    <Box className={classes["static-card"]}>
      <p className={classes["static-card-title"]}>Revenue</p>
      <p className={classes["static-card-number"]}>1000</p>
      <Flex
        justify={"space-between"}
        align={"flex-end"}
      >
        <p className={classes["static-card-link"]}>View detail</p>
        <ThemeIcon
          variant="light"
          color={_.sample(["blue", "green", "red", "yellow"])}
          style={{
            height: rem(40),
            width: rem(40),
          }}
        >
          <IconList
            style={{ width: "60%", height: "60%" }}
            stroke={1.5}
          />
        </ThemeIcon>
      </Flex>
    </Box>
  );
};

const ShopHomePage = () => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const { data, lastJsonMessage, readyState } = useReports();

  return (
    <Box m={rem(32)}>
      <Grid
        justify="space-between"
        columns={24}
      >
        {[1, 2, 3, 4].map((item) => (
          <Grid.Col
            span={5}
            key={item}
          >
            <TitleAndNumberCard />
          </Grid.Col>
        ))}
      </Grid>
      <Card
        my={rem(32)}
        style={{
          backgroundColor:
            computedColorScheme === "light" ? "white" : "#1f1f1f",
        }}
      >
        <Card.Section
          withBorder
          inheritPadding
        >
          <Group
            justify="space-between"
            my={rem(20)}
          >
            <Text
              size="lg"
              fw={"bold"}
              fz={22}
              c={"light-blue.4"}
            >
              LIVE SHOP COUNT
            </Text>
          </Group>
        </Card.Section>
        <Text mt={20}>Connection status: {returnWebsocketConnection(readyState)}</Text>
        <Text mt={10}>Last update: {lastJsonMessage ? getDateTime(lastJsonMessage.Time) : "None"}</Text>
        <LineChart
          h={300}
          data={data}
          dataKey="Time"
          py={rem(40)}
          series={[
            { name: "Total", color: "light-blue.6" },
          ]}
        />
      </Card>
    </Box>
  );
};

export default ShopHomePage;
