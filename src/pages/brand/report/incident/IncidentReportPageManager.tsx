import {
  Box,
  Card,
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
    <Box pb={rem(40)} mx={rem(28)} mt={rem(28)}>
      <Group justify="space-between" my={rem(20)}>
        <Text size="lg" fw={"bold"} fz={22} c={"light-blue.4"}>
          INCIDENT REPORT
        </Text>
        {isGetShopListLoading ? (
          <Loader />
        ) : (
          <Select
            value={selectedShop}
            onChange={setSelectedShop}
            size="md"
            w={rem(320)}
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

      <Card shadow="xs" pb={rem(40)}>
        <Tabs
          keepMounted={false}
          variant="default"
          defaultValue="ByEmployee"
          c={"blue"}
          color="blue"
        >
          <Tabs.List>
            <Tabs.Tab
              value="ByEmployee"
              leftSection={<IconUser style={iconStyle} />}
            >
              <Text size="md" fw={500}>
                Employee report
              </Text>
            </Tabs.Tab>
            <Tabs.Tab
              value="ByTime"
              leftSection={<IconClock style={iconStyle} />}
            >
              <Text size="md" fw={500}>
                Time report
              </Text>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="ByEmployee">
            <EmployeeIncidentReportTab shopId={selectedShop} />
          </Tabs.Panel>

          <Tabs.Panel value="ByTime">
            <TimeIncidentReportTab shopId={selectedShop} />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Box>
  );
};

export default IncidentReportPageManager;
