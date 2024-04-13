import { Box, Card, Group, Skeleton, Text, rem } from "@mantine/core";
import { useGetIncidentReportByTime } from "../../../../hooks/useGetIncidentReportByTime";
import { IncidentType, ReportInterval } from "../../../../models/CamAIEnum";
import { useMemo } from "react";
import dayjs from "dayjs";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../../../components/form/EditAndUpdateForm";
import { useForm } from "@mantine/form";
import { GetIncidentReportByTimeParams } from "../../../../apis/IncidentAPI";
import _ from "lodash";
import NoImage from "../../../../components/image/NoImage";
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
type SearchIncidentField = {
  startDate?: Date;
  toDate?: Date;
  interval: ReportInterval;
};

const TimeIncidentReport = () => {
  const form = useForm<SearchIncidentField>({
    validateInputOnChange: true,
    initialValues: {
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      toDate: new Date(),
      interval: ReportInterval.HalfHour,
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

  const searchParams: GetIncidentReportByTimeParams & { enabled: boolean } =
    useMemo(() => {
      if (form.isValid() && form.values.startDate && form.values.toDate) {
        let sb: GetIncidentReportByTimeParams & { enabled: boolean } = {
          startDate: form.values.startDate
            ? dayjs(form.values.startDate).format("YYYY-MM-DD")
            : undefined,
          endDate: form.values.toDate
            ? dayjs(form.values.toDate).format("YYYY-MM-DD")
            : undefined,
          interval: form.values.interval,
          enabled: true,
          type: IncidentType.Incident,
        };
        sb = _.omitBy(sb, _.isNil) as GetIncidentReportByTimeParams & {
          enabled: boolean;
        };
        return sb;
      } else {
        return {
          enabled: true,
          interval: form.values.interval,
          type: IncidentType.Incident,
        };
      }
    }, [form.values.interval, form.values.startDate, form.values.toDate]);

  const {
    data: incidentReportByTimeData,
    isLoading: isGetIncidentReportByTimeDataLoading,
  } = useGetIncidentReportByTime(searchParams);

  const data = useMemo(() => {
    if (isGetIncidentReportByTimeDataLoading) {
      return [];
    }
    return incidentReportByTimeData?.data.map((item) => {
      return {
        time: dayjs(item.time).format("HH:mm | DD-MM"),
        count: item.count,
      };
    });
  }, [incidentReportByTimeData]);

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
            {
              value: ReportInterval.Week,
              label: "1 week",
            },
          ],
        },
        spans: 4,
      },
    ];
  }, [form]);

  // data?.map((i) => {
  //   console.log(i.time);
  // });

  return (
    <Skeleton visible={isGetIncidentReportByTimeDataLoading}>
      <Card shadow="md" pb={rem(40)}>
        <Card.Section withBorder inheritPadding mb={rem(32)}>
          <Group justify="flex-end" my={rem(20)}>
            <Group>
              <Text size="md" fw={500}>
                Filter
              </Text>
              <Box miw={rem(360)}>
                <EditAndUpdateForm fields={fields} />
              </Box>
            </Group>
          </Group>
        </Card.Section>

        {!incidentReportByTimeData ||
        incidentReportByTimeData?.data?.length == 0 ? (
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
                      label: "Total incidents",
                      data: data?.map((i) => i.count),
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
    </Skeleton>
  );
};

export default TimeIncidentReport;
