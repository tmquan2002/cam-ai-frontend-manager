import { useForm } from "@mantine/form";
import { IncidentType, ReportInterval } from "../../../../models/CamAIEnum";
import { GetIncidentReportByTimeParams } from "../../../../apis/IncidentAPI";
import { useMemo } from "react";
import dayjs from "dayjs";
import _ from "lodash";
import { Box, Card, Flex, Group, Skeleton, Text, rem } from "@mantine/core";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../../../components/form/EditAndUpdateForm";
import NoImage from "../../../../components/image/NoImage";
import { useGetIncidentReportByTime } from "../../../../hooks/useGetIncidentReportByTime";
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

import { Chart } from "react-chartjs-2";
import LegendCard from "../../../../components/card/LegendCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type TimeIncidentReportTabProps = {
  shopId: string | null;
};

type SearchIncidentField = {
  startDate?: Date;
  toDate?: Date;
  interval: ReportInterval;
};

const TimeIncidentReportTab = ({ shopId }: TimeIncidentReportTabProps) => {
  const form = useForm<SearchIncidentField>({
    validateInputOnChange: true,
    initialValues: {
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      toDate: new Date(),
      interval: ReportInterval.HalfDay,
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
      if (!shopId)
        return {
          enabled: false,
          interval: form.values.interval,
          shopId: shopId ?? undefined,
          type: IncidentType.Incident,
        };

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
          shopId: shopId ?? undefined,
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
          shopId: shopId ?? undefined,
          type: IncidentType.Incident,
        };
      }
    }, [
      form.values.interval,
      form.values.startDate,
      form.values.toDate,
      shopId,
    ]);
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
        time: dayjs(item.time).format("HH:mm DD-MM"),
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
          fontWeight: 500,
          radius: rem(8),
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form,
          name: "toDate",
          placeholder: "End date",
          fontWeight: 500,
          radius: rem(8),
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          form,
          name: "interval",
          placeholder: "Interval",
          fontWeight: 500,
          radius: rem(8),
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

  return (
    <Box pb={rem(40)}>
      <Skeleton visible={isGetIncidentReportByTimeDataLoading}>
        <Box
          style={{
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginTop: rem(20),
            overflow: "hidden",
          }}
        >
          <Box
            mb={rem(32)}
            bg={"#f9fafb"}
            py={rem(20)}
            style={{
              borderBottom: "1px solid #ccc",
            }}
          >
            <Group justify="flex-end" mr={rem(20)}>
              <Group>
                <Box miw={rem(360)}>
                  <EditAndUpdateForm fields={fields} />
                </Box>
              </Group>
            </Group>
          </Box>

          {!shopId ? (
            <Text size="lg" fw={600}>
              Please select shop
            </Text>
          ) : !incidentReportByTimeData ||
            incidentReportByTimeData?.data?.length == 0 ? (
            <NoImage type="NO_DATA" />
          ) : (
            <Box>
              <Group justify="flex-end" mt={rem(20)} mb={rem(6)} mr={rem(12)}>
                <LegendCard
                  type="line"
                  color="rgb(37, 150, 190)"
                  title="Total incident"
                />
                <LegendCard
                  type="bar"
                  color="rgba(255, 99, 132, 1)"
                  title="Average incident time"
                />
              </Group>
              <Flex mb={rem(32)}>
                <Box
                  style={{
                    width: "40px",
                    zIndex: 999,
                    backgroundColor: "#fff",
                  }}
                >
                  <Chart
                    type="bar"
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      layout: {
                        padding: {
                          bottom: 47,
                        },
                      },

                      scales: {
                        x: {
                          ticks: {
                            display: false,
                          },
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          ticks: {
                            padding: 10,
                          },
                          beginAtZero: true,
                          afterFit: (ctx) => {
                            ctx.width = 39;
                          },
                          grid: {
                            drawTicks: false,
                          },
                          border: {
                            color: "#000",
                          },
                          suggestedMax: 10,
                        },
                      },

                      plugins: {
                        title: {
                          display: false,
                        },
                        legend: {
                          display: false,
                        },
                      },
                    }}
                    data={{
                      labels: data?.map((i) => i.time),
                      datasets: [
                        {
                          type: "bar",
                          label: "Total interactions",
                          borderColor: "rgb(37, 150, 190)",
                          backgroundColor: "rgb(37, 150, 190, 0.5)",
                          data: data?.map((i) => i.count),
                        },
                      ],
                    }}
                  />
                </Box>

                <Box
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    height: "620px",
                    overflowX: "scroll",
                    transform: "translateX(-9px)",
                  }}
                >
                  <Box
                    style={
                      data && data?.length > 7
                        ? {
                            width: `${1500 + (data?.length - 7) * 70}px`,
                            height: "600px",
                          }
                        : {
                            height: "600px",
                          }
                    }
                  >
                    <Chart
                      type="line"
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                          padding: {
                            top: 17,
                          },
                        },
                        scales: {
                          y: {
                            ticks: {
                              display: false,
                            },

                            grid: {
                              drawTicks: false,
                              tickWidth: 0,
                              tickLength: 0,
                              tickColor: "#000",
                            },

                            border: {
                              dash: [8, 4],
                            },
                            suggestedMax: 10,
                          },
                          x: {
                            ticks: {
                              padding: 10,
                            },

                            border: {
                              color: "#000",
                              dash: [8, 4],
                            },
                            beginAtZero: true,
                            grid: {
                              drawTicks: false,
                            },
                          },
                        },
                        plugins: {
                          title: {
                            display: false,
                          },
                          legend: {
                            display: false,
                          },
                        },
                        onClick(_event, elements, _chart) {
                          if (elements.length > 0) {
                            const selectedData =
                              incidentReportByTimeData?.data?.[
                                elements[0].index
                              ];
                            // setSelectedIncidentItem(null);
                            // setSelectedDuration({
                            //   startTime: selectedData?.time,
                            //   endTime: addDaysBaseOnReportInterval(
                            //     selectedData?.time,
                            //     form.values.interval
                            //   ),
                            // });
                          }
                        },
                      }}
                      data={{
                        labels: data?.map((i) => i.time),
                        datasets: [
                          {
                            type: "line",
                            label: "Total incident ",
                            data: data?.map((i) => i.count),
                            borderColor: "rgb(37, 150, 190)",
                            backgroundColor: "rgb(37, 150, 190, 0.5)",
                            cubicInterpolationMode: "monotone",
                            pointHoverRadius: 7,
                            pointHoverBackgroundColor: "#fff",
                            pointBackgroundColor: "rgb(37, 150, 190)",
                            borderWidth: 2,
                            pointRadius: 3,
                            fill: true,
                            pointHitRadius: 7,
                          },
                          {
                            type: "bar" as const,
                            label: "Average duration ",
                            data: data?.map((i) => i.count),
                            hidden: true,
                          },
                        ],
                      }}
                    />
                  </Box>
                </Box>
              </Flex>
            </Box>
          )}
        </Box>
      </Skeleton>
    </Box>
  );
};

export default TimeIncidentReportTab;
