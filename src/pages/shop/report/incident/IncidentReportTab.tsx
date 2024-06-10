import _ from "lodash";
import EmployeeIncidentReport from "./EmployeeIncidentReport";
import {
  Box,
  Flex,
  Tabs,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import TimeIncidentReport from "./TimeIncidentReport";
import { IconUser } from "@tabler/icons-react";

const IncidentReportPage = () => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const iconStyle = { width: rem(20), height: rem(20) };

  return (
    <Flex
      px={rem(40)}
      pt={rem(12)}
      flex={1}
      direction={"column"}
      bg={computedColorScheme == "light" ? "#fff" : "#1a1a1a"}
    >
      <Text size={rem(24)} fw={700} my={rem(20)} c={"light-blue"} mb={rem(24)}>
        Incident report
      </Text>

      <Box>
        <Tabs keepMounted={false} defaultValue="ByEmployee">
          <Tabs.List>
            <Tabs.Tab
              value="ByEmployee"
              leftSection={<IconUser style={iconStyle} />}
            >
              <Text fw={500}>By employee</Text>
            </Tabs.Tab>
            <Tabs.Tab
              value="ByTime"
              leftSection={<IconClock style={iconStyle} />}
            >
              <Text fw={500}>By time</Text>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="ByEmployee">
            <EmployeeIncidentReport />
          </Tabs.Panel>

          <Tabs.Panel value="ByTime">
            <TimeIncidentReport />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default IncidentReportPage;
