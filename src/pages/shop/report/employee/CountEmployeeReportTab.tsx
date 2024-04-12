import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Box, Card, Group, Select, Text, rem } from "@mantine/core";
import { useShopHumanCountReport } from "../../../../hooks/useGetHumanCountReport";
import dayjs from "dayjs";
import { ReportInterval } from "../../../../models/CamAIEnum";
import { useMemo } from "react";
import NoImage from "../../../../components/image/NoImage";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

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

const CountEmployeeReportPage = () => {
  const { data: humanCountData, isLoading: isGetHumanCountDataLoading } =
    useShopHumanCountReport({
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
      interval: ReportInterval.HalfHour,
    });

  const data = useMemo(() => {
    if (isGetHumanCountDataLoading) {
      return [];
    }
    return humanCountData?.data.map((item) => {
      return {
        time: dayjs(item.Time).format("HH:mm | DD-MM"),
        average: item?.Median,
      };
    });
  }, [humanCountData]);

  return (
    <Box pb={rem(40)} mx={rem(20)} mt={rem(12)}>
      <Text size="lg" fw={"bold"} fz={22} c={"light-blue.4"} my={rem(20)}>
        EMPLOYEE COUNT REPORT
      </Text>
      <Card shadow="xs" pb={rem(40)}>
        <Card.Section withBorder inheritPadding mb={rem(32)}>
          <Group justify="space-between" my={rem(20)}>
            <Text size="lg" fw={500}>
              Employee count indicators
            </Text>
            <Group>
              <Text size="md" fw={500}>
                Filter
              </Text>

              <Select placeholder="Interval" data={["Day", "Week", "Month"]} />
            </Group>
          </Group>
        </Card.Section>

        {!humanCountData || humanCountData?.data?.length == 0 ? (
          <NoImage />
        ) : (
          <Box
            style={{
              width: "100%",
              maxWidth: "100%",
              height: "640px",
              overflowX: "scroll",
            }}
          >
            <Box
              style={
                data && data?.length > 7
                  ? {
                      width: `${1500 + (data?.length - 7) * 30}px`,
                      height: "600px",
                    }
                  : {
                      height: "600px",
                    }
              }
            >
              <Line
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    title: {
                      display: true,
                    },
                  },
                }}
                data={{
                  labels: data?.map((i) => i.time),
                  datasets: [
                    {
                      label: "Total interactions",
                      data: data?.map((i) => i.average),
                      borderColor: "rgb(255, 99, 132)",
                      backgroundColor: "rgba(255, 99, 132, 0.5)",
                    },
                  ],
                }}
              ></Line>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default CountEmployeeReportPage;
