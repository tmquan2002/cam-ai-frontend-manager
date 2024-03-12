import { LineChart } from "@mantine/charts";
import {
  Box, Card, Flex, Grid, Group,
  Text, ThemeIcon, rem, useComputedColorScheme
} from "@mantine/core";
import { IconList } from "@tabler/icons-react";
import * as _ from "lodash";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { getAccessToken } from "../../context/AuthContext";
import { getDateTime, removeDate, removeFirstUpdateLastArray, returnWebsocketConnection } from "../../utils/helperFunction";
import classes from "./ShopHomePage.module.scss";

export interface ChartReportData {
  Time: string;
  Total: number;
  ShopId: string
}


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

  const { lastJsonMessage, readyState } = useWebSocket<ChartReportData>(process.env.REACT_APP_VITE_WEB_SOCKET_LINK + "/api/shops/chart/customer", {
    protocols: ["Bearer", `${getAccessToken()}`]
  })

  const [data, setData] = useState<ChartReportData[]>(Array.apply(null, Array(5))
    .map(function () {
      return {
        Time: "00:00:00",
        Total: 0,
        ShopId: "",
      }
    }))

  const latestDataRef = useRef(data);

  useEffect(() => {
    if (lastJsonMessage) {

      const updatedJson = {
        ...lastJsonMessage,
        Time: removeDate(lastJsonMessage.Time, true)
      };

      const newArray = removeFirstUpdateLastArray<ChartReportData>(data, updatedJson);
      latestDataRef.current = newArray;
      console.log(newArray)
      setData(newArray);
    }
  }, [lastJsonMessage]);

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
              TOTAL PEOPLE CURRENTLY IN THE SHOP
            </Text>
          </Group>
        </Card.Section>
        <Text mt={20}>Connection status: {returnWebsocketConnection(readyState)}</Text>
        <Text mt={10}>Last update: {lastJsonMessage ? getDateTime(lastJsonMessage.Time) : "None"}</Text>
        <LineChart
          h={300}
          data={latestDataRef.current}
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
