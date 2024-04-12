import _ from "lodash";
import EmployeeIncidentReport from "./EmployeeIncidentReport";
import { Box, Card, Tabs, Text, rem } from "@mantine/core";
import { IconClock, IconUser } from "@tabler/icons-react";
import TimeIncidentReport from "./TimeIncidentReport";

const IncidentReportPage = () => {
  const iconStyle = { width: rem(20), height: rem(20) };

  return (
    <Box pb={rem(40)} mx={rem(20)} mt={rem(12)}>
      <Text size="lg" fw={"bold"} fz={22} c={"light-blue.4"} my={rem(20)}>
        INCIDENT REPORT
      </Text>

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
            <EmployeeIncidentReport />
          </Tabs.Panel>

          <Tabs.Panel value="ByTime">
            <TimeIncidentReport />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Box>
  );
};

export default IncidentReportPage;
