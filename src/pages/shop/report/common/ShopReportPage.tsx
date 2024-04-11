import { LineChart } from "@mantine/charts";
import { Box, Card, Group, Select, Text, rem } from "@mantine/core";
import { useState } from "react";
import _ from "lodash";
import { InteractionReportDetail } from "../../../../models/Report";
import CustomerReportTab from "../customer/CustomerReportTab";
import IncidentReportTab from "../incident/IncidentReportTab";

enum ReportType {
  CountCustomer = "CountCustomer",
  Incident = "Incident",
  Interaction = "Interaction",
}

const ShopReportPage = () => {
  const [reportType, setReportType] = useState<ReportType>(
    ReportType.CountCustomer
  );

  return (
    <Box pb={rem(40)} mx={rem(40)}>
      <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"} my={rem(20)}>
        REPORT
      </Text>

      <Card shadow="xs" mb={rem(16)}>
        <Card.Section withBorder inheritPadding>
          <Group justify="space-between" my={rem(20)}>
            <Text size="lg" fw={500}>
              Report type
            </Text>
            <Group>
              <Select
                size="md"
                onChange={(value: string | null) =>
                  setReportType(
                    value
                      ? ReportType[value as keyof typeof ReportType]
                      : ReportType.CountCustomer
                  )
                }
                placeholder="Report type"
                allowDeselect={false}
                defaultValue={ReportType.CountCustomer}
                data={[
                  {
                    value: ReportType.CountCustomer,
                    label: "Count customer",
                  },
                  {
                    value: ReportType.Incident,
                    label: "Incident",
                  },

                  {
                    value: ReportType.Interaction,
                    label: "Interaction count",
                  },
                ]}
              />
            </Group>
          </Group>
        </Card.Section>
      </Card>
    </Box>
  );
};

export default ShopReportPage;
