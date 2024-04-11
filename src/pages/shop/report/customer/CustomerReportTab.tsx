import { LineChart } from "@mantine/charts";
import { Card, Group, Select, Text, rem } from "@mantine/core";

export const data = [
  {
    date: "Mar 22",
    Apples: 2890,
    Oranges: 2338,
    Tomatoes: 2452,
  },
  {
    date: "Mar 23",
    Apples: 2756,
    Oranges: 2103,
    Tomatoes: 2402,
  },
  {
    date: "Mar 24",
    Apples: 3322,
    Oranges: 986,
    Tomatoes: 1821,
  },
  {
    date: "Mar 25",
    Apples: 3470,
    Oranges: 2108,
    Tomatoes: 2809,
  },
  {
    date: "Mar 26",
    Apples: 3129,
    Oranges: 1726,
    Tomatoes: 2290,
  },
];

const CustomerReportPage = () => {
  return (
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
        data={data}
        dataKey="date"
        series={[
          { name: "Apples", color: "indigo.6" },
          { name: "Oranges", color: "blue.6" },
          { name: "Tomatoes", color: "teal.6" },
        ]}
        curveType="linear"
      />
    </Card>
  );
};

export default CustomerReportPage;
