import { BarChart } from "@mantine/charts";
import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Grid,
  Group,
  Menu,
  Table,
  Text,
  ThemeIcon,
  rem,
  useComputedColorScheme
} from "@mantine/core";
import {
  IconDots,
  IconEye,
  IconFileZip,
  IconList,
  IconTrash,
} from "@tabler/icons-react";
import * as _ from "lodash";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { getAccessToken } from "../../context/AuthContext";
import { removeDate, removeFirstUpdateLastArray } from "../../utils/helperFunction";
import classes from "./ShopHomePage.module.scss";

export interface ChartReportData {
  Time: string;
  Total: number;
  ShopId: string
}

const elements = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];

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

  const { lastJsonMessage } = useWebSocket<ChartReportData>(process.env.REACT_APP_VITE_WEB_SOCKET_LINK + "/api/shops/chart/customer", {
    protocols: ["Bearer", `${getAccessToken()}`]
  })

  const [data, setData] = useState<ChartReportData[]>(Array.apply(null, Array(10))
    .map(function () {
      return {
        Time: "00:00:00",
        Total: 0,
        ShopId: "",
      }
    }))

  useEffect(() => {
    if (lastJsonMessage) {

      const updatedJson = {
        ...lastJsonMessage,
        Time: removeDate(lastJsonMessage.Time)
      };

      const newArray = removeFirstUpdateLastArray<ChartReportData>(data, updatedJson, 10);
      setData(newArray);
    }
  }, [lastJsonMessage]);

  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td>
    </Table.Tr>
  ));
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
              STATIC VALUES
            </Text>

            <Menu
              withinPortal
              position="bottom-end"
              shadow="sm"
            >
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                >
                  <IconDots style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconFileZip style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Download zip
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconEye style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Preview all
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                  color="red"
                >
                  Delete all
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Card.Section>
        <Text mt={20}>Last update: {removeDate(lastJsonMessage ? lastJsonMessage.Time : "00:00:00", true)}</Text>
        <BarChart
          h={300}
          data={data}
          dataKey="Time"
          tooltipAnimationDuration={200}
          py={rem(40)}
          series={[
            { name: "Total", color: "light-blue.6" },
          ]}
        />
      </Card>

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
              INICIDENT VALUES
            </Text>

            <Menu
              withinPortal
              position="bottom-end"
              shadow="sm"
            >
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                >
                  <IconDots style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconFileZip style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Download zip
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconEye style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Preview all
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                  color="red"
                >
                  Delete all
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Card.Section>
        <Table
          highlightOnHover
          verticalSpacing={"md"}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Element position</Table.Th>
              <Table.Th>Element name</Table.Th>
              <Table.Th>Symbol</Table.Th>
              <Table.Th>Atomic mass</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
};

export default ShopHomePage;
