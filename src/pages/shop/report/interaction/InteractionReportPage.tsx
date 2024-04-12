import { Box, Card, Group, Select, Text, rem } from "@mantine/core";
import { InteractionReportDetail } from "../../../../models/Report";
import { LineChart } from "@mantine/charts";

export const InteractionReportPage = () => {
  const fackeData: InteractionReportDetail[] = [
    {
      averageInteractionTime: 5,
      interactionList: [],
      totalInteraction: 20,
      totalTime: 100,
      time: "123",
    },
    {
      averageInteractionTime: 8,
      interactionList: [],
      totalInteraction: 12,
      totalTime: 90,
      time: "124",
    },
    {
      averageInteractionTime: 4,
      interactionList: [],
      totalInteraction: 12,
      totalTime: 140,
      time: "1",
    },
    {
      averageInteractionTime: 4,
      interactionList: [],
      totalInteraction: 12,
      totalTime: 140,
      time: "12",
    },
    {
      averageInteractionTime: 4,
      interactionList: [],
      totalInteraction: 12,
      totalTime: 140,
      time: "3",
    },
    {
      averageInteractionTime: 4,
      interactionList: [],
      totalInteraction: 12,
      totalTime: 140,
      time: "14",
    },
    {
      averageInteractionTime: 4,
      interactionList: [],
      totalInteraction: 12,
      totalTime: 140,
      time: "5",
    },
  ];

  return (
    <Box pb={rem(40)} mx={rem(20)} mt={rem(12)}>
      <Text size="lg" fw={"bold"} fz={22} c={"light-blue.4"} my={rem(20)}>
        INTERACTION REPORT
      </Text>
      <Card shadow="xs" pb={rem(40)}>
        <Card.Section withBorder inheritPadding mb={rem(32)}>
          <Group justify="space-between" my={rem(20)}>
            <Text size="lg" fw={500}>
              Customer count indicators
            </Text>
            <Group>
              <Text size="md" fw={500}>
                Filter
              </Text>

              <Select placeholder="Interval" data={["Day", "Week", "Month"]} />
            </Group>
          </Group>
        </Card.Section>

        <LineChart
          h={300}
          data={fackeData}
          dataKey="time"
          series={[
            { name: "totalTime", color: "indigo.6" },
            { name: "totalInteraction", color: "blue.6" },
            { name: "averageInteractionTime", color: "teal.6" },
          ]}
          curveType="linear"
        />
      </Card>
    </Box>
  );
};
