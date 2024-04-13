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
import { Box, Card, Group, Text, rem } from "@mantine/core";
import { useShopHumanCountReport } from "../../../../hooks/useGetHumanCountReport";
import dayjs from "dayjs";
import { ReportInterval } from "../../../../models/CamAIEnum";
import { useMemo } from "react";
import NoImage from "../../../../components/image/NoImage";
import { Line } from "react-chartjs-2";
import { useForm } from "@mantine/form";
import { GetShopHumanCountReportParams } from "../../../../apis/ReportAPI";
import _ from "lodash";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../../../components/form/EditAndUpdateForm";
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

type SearchCountHumanField = {
  startDate?: Date;
  toDate?: Date;
  interval: ReportInterval;
};

const CountEmployeeReportPage = () => {
  const form = useForm<SearchCountHumanField>({
    validateInputOnChange: true,
    initialValues: {
      startDate: new Date(Date.now()),
      toDate: new Date(Date.now()),
      interval: ReportInterval.Hour,
    },
    validate: (values) => ({
      toDate:
        values.startDate &&
        values?.toDate &&
        values?.toDate?.getTime() < values?.startDate?.getTime()
          ? "End date must be after start date"
          : null,
      fromTime:
        values.toDate &&
        values?.startDate &&
        values?.toDate?.getTime() < values?.startDate?.getTime()
          ? "Start date must be before end date"
          : null,
    }),
  });

  const searchParams: GetShopHumanCountReportParams = useMemo(() => {
    let sb: GetShopHumanCountReportParams = {
      startDate: form.values.startDate
        ? dayjs(form.values.startDate).format("YYYY-MM-DD")
        : "",
      endDate: form.values.toDate
        ? dayjs(form.values.toDate).format("YYYY-MM-DD")
        : "",
      interval: form.values.interval,
    };
    sb = _.omitBy(sb, _.isNil) as GetShopHumanCountReportParams;
    return sb;
  }, [form.values.interval, form.values.startDate, form.values.toDate]);

  const { data: humanCountData, isLoading: isGetHumanCountDataLoading } =
    useShopHumanCountReport(searchParams);

  const data = useMemo(() => {
    if (isGetHumanCountDataLoading) {
      return [];
    }
    return humanCountData?.data.map((item) => {
      return {
        time: dayjs(item.time).format("HH:mm | DD-MM"),
        average: item?.median,
        low: item?.low,
        high: item?.high,
      };
    });
  }, [humanCountData]);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form,
          name: "startDate",
          placeholder: "Start date",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form,
          name: "toDate",
          placeholder: "End date",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          form,
          name: "interval",
          placeholder: "Interval",
          data: [
            {
              value: ReportInterval.HalfHour,
              label: "30 minutes",
            },
            {
              value: ReportInterval.Hour,
              label: "1 hour",
            },
            {
              value: ReportInterval.HalfDay,
              label: "12 hours",
            },
            {
              value: ReportInterval.Day,
              label: "1 day",
            },
            // {
            //   value: ReportInterval.Week,
            //   label: "1 week",
            // },
          ],
        },
        spans: 4,
      },
    ];
  }, [form]);

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
            <Group justify="space-between">
              <Text size="md" fw={500}>
                Filter
              </Text>

              <Box miw={rem(360)}>
                <EditAndUpdateForm fields={fields} />
              </Box>
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
                    {
                      label: "Lowest interaction",
                      data: data?.map((i) => i.low),
                      borderColor: "rgb(236,177,109)",
                      backgroundColor: "rgba(236,177,109,0.5)",
                    },
                    {
                      label: "Highest interactions",
                      data: data?.map((i) => i.high),
                      borderColor: "rgb(37, 150, 190)",
                      backgroundColor: "rgb(37, 150, 190, 0.5)",
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
