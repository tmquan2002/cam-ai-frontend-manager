import {
  Box,
  Flex,
  Group,
  Loader,
  Select,
  Tabs,
  Text,
  rem,
} from "@mantine/core";
import { IconClock, IconUser } from "@tabler/icons-react";
import EmployeeIncidentReportTab from "./EmployeeIncidentReportTab";
import TimeIncidentReportTab from "./TimeIncidentReportTab";
import { useGetShopList } from "../../../../hooks/useGetShopList";
import { useState } from "react";

const IncidentReportPageManager = () => {
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const iconStyle = { width: rem(20), height: rem(20) };
  const { data: shopList, isLoading: isGetShopListLoading } = useGetShopList({
    enabled: true,
    size: 999,
  });

  return (
    <Flex px={rem(40)} pt={rem(20)} bg={"#fff"} flex={1} direction={"column"}>
      <Group justify="space-between" align="center" my={rem(20)}>
        <Text size="lg" fw={"bold"} fz={22} c={"light-blue.4"}>
          Incident Report
        </Text>
        {isGetShopListLoading ? (
          <Loader />
        ) : (
          <Select
            value={selectedShop}
            onChange={setSelectedShop}
            size="sm"
            radius={rem(8)}
            w={rem(320)}
            style={{
              fontWeight: 500,
            }}
            styles={{
              dropdown: {
                fontWeight: 500,
              },
            }}
            data={
              shopList
                ? shopList?.values.map((item) => {
                    return {
                      value: item?.id,
                      label: item?.name,
                    };
                  })
                : []
            }
            placeholder={"Select a shop"}
          />
        )}
      </Group>

      <Box pb={rem(40)}>
        <Tabs keepMounted={false} variant="default" defaultValue="ByEmployee">
          <Tabs.List>
            <Tabs.Tab
              value="ByEmployee"
              leftSection={<IconUser style={iconStyle} />}
            >
              <Text fw={500}>Employee report</Text>
            </Tabs.Tab>
            <Tabs.Tab
              value="ByTime"
              leftSection={<IconClock style={iconStyle} />}
            >
              <Text fw={500}>Time report</Text>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="ByEmployee">
            {selectedShop ? (
              <EmployeeIncidentReportTab shopId={selectedShop} />
            ) : (
              <Text mt={rem(28)} size="md" fw={500}>
                No shop selected
              </Text>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="ByTime">
            {selectedShop ? (
              <TimeIncidentReportTab shopId={selectedShop} />
            ) : (
              <Text size="md" mt={rem(28)} fw={500}>
                No shop selected
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default IncidentReportPageManager;
