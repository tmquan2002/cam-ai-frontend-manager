import _ from "lodash";
import EmployeeIncidentReport from "./EmployeeIncidentReport";
import { Box, Flex, Tabs, Text, rem } from "@mantine/core";
import { IconClock, IconUser } from "@tabler/icons-react";
import TimeIncidentReport from "./TimeIncidentReport";

const IncidentReportPage = () => {
  const iconStyle = { width: rem(20), height: rem(20) };

  return (
    <Flex px={rem(28)} pt={rem(12)} bg={"#fff"} flex={1} direction={"column"}>
      <Text
        size={rem(26)}
        fw={700}
        my={rem(20)}
        c={"light-blue.4"}
        mb={rem(12)}
      >
        Incident report
      </Text>

      <Box>
        <Tabs
          keepMounted={false}
          variant="default"
          defaultValue="ByEmployee"
          c={"blue"}
          color="blue"
        >
          <Tabs.List>
            <Tabs.Tab
              pt={rem(20)}
              value="ByEmployee"
              leftSection={<IconUser style={iconStyle} />}
            >
              <Text size="md" fw={600}>
                Employee report
              </Text>
            </Tabs.Tab>
            <Tabs.Tab
              pt={rem(20)}
              value="ByTime"
              leftSection={<IconClock style={iconStyle} />}
            >
              <Text size="md" fw={600}>
                Time report
              </Text>
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
