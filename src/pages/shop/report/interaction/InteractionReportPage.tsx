import {
  Badge,
  Box,
  Card,
  Center,
  Flex,
  Group,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  Transition,
  rem,
} from "@mantine/core";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart } from "react-chartjs-2";
import { IncidentType, ReportInterval } from "../../../../models/CamAIEnum";
import NoImage from "../../../../components/image/NoImage";
import { useForm } from "@mantine/form";
import { GetIncidentReportByTimeParams } from "../../../../apis/IncidentAPI";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import _ from "lodash";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../../../components/form/EditAndUpdateForm";
import { useGetIncidentReportByTime } from "../../../../hooks/useGetIncidentReportByTime";
import LegendCard, {
  LEGEND_TYPES,
} from "../../../../components/card/LegendCard";
import { useGetIncidentList } from "../../../../hooks/useGetIncidentList";
import { IncidentDetail } from "../../../../models/Incident";
import classes from "./InteractionReportPage.module.scss";
import cx from "clsx";
import LoadingImage from "../../../../components/image/LoadingImage";
import { useScrollIntoView } from "@mantine/hooks";
import {
  addDaysBaseOnReportInterval,
  differentDateReturnFormattedString,
} from "../../../../utils/helperFunction";
dayjs.extend(LocalizedFormat);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  BarController
);
type SearchIncidentField = {
  startDate?: Date;
  toDate?: Date;
  interval: ReportInterval;
};

export const InteractionReportPage = () => {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const [scrolled, setScrolled] = useState(false);
  const {
    scrollIntoView: scrollIntoInteractionDetail,
    targetRef: interactionDetailRef,
  } = useScrollIntoView<HTMLDivElement>();
  const [selectedDuration, setSelectedDuration] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);

  const [selectedInteractionItem, setSelectedInteractionItem] =
    useState<IncidentDetail | null>(null);

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
          type: IncidentType.Interaction,
        };
        sb = _.omitBy(sb, _.isNil) as GetIncidentReportByTimeParams & {
          enabled: boolean;
        };
        return sb;
      } else {
        return {
          enabled: true,
          interval: form.values.interval,
          type: IncidentType.Interaction,
        };
      }
    }, [form.values.interval, form.values.startDate, form.values.toDate]);

  const {
    data: incidentReportByTimeData,
    isLoading: isGetIncidentReportByTimeDataLoading,
  } = useGetIncidentReportByTime(searchParams);

  const { data: interactionList, isLoading: isGetInteractionListLoading } =
    useGetIncidentList({
      enabled: !!selectedDuration,
      fromTime: selectedDuration?.startTime,
      toTime: selectedDuration?.endTime,
      incidentType: IncidentType.Interaction,
    });

  const data = useMemo(() => {
    if (isGetIncidentReportByTimeDataLoading) {
      return [];
    }
    return incidentReportByTimeData?.data.map((item) => {
      return {
        time: dayjs(item.time).format("HH:mm DD-MM"),
        count: item.count,
        avarageDuration: item?.averageDuration ? item?.averageDuration / 60 : 0,
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

  const rows = isGetInteractionListLoading ? (
    <Table.Tr>
      <Table.Td>
        <Skeleton w={"100%"} h={rem(40)} />
      </Table.Td>
      <Table.Td py={rem(18)}>
        <Skeleton w={"100%"} h={rem(40)} />
      </Table.Td>
      <Table.Td py={rem(18)}>
        <Skeleton w={"100%"} h={rem(40)} />
      </Table.Td>

      <Table.Td py={rem(18)}>
        <Skeleton w={"100%"} h={rem(40)} />
      </Table.Td>
      <Table.Td py={rem(18)}>
        <Skeleton w={"100%"} h={rem(40)} />
      </Table.Td>
    </Table.Tr>
  ) : (
    interactionList?.values.map((item, index) => (
      <Table.Tr
        key={item.startTime}
        style={{
          cursor: "pointer",
        }}
        onClick={() => setSelectedInteractionItem(item)}
        className={
          item?.id == selectedInteractionItem?.id
            ? classes["selectedInteraction"]
            : ""
        }
      >
        <Table.Td>
          <Center>
            <Text c={"rgb(17 24 39"} fw={500} size={rem(13)}>
              {index + 1}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text c={"rgb(17 24 39"} fw={500} size={rem(13)}>
              {item?.startTime
                ? dayjs(item.startTime).format("HH:mm | DD-MM")
                : "Empty"}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text c={"rgb(17 24 39"} fw={500} size={rem(13)}>
              {item?.endTime
                ? dayjs(item.endTime).format("HH:mm | DD-MM")
                : "Empty"}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text c={"rgb(17 24 39"} fw={500} size={rem(13)}>
              {item.evidences.length}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text c={"rgb(17 24 39"} fw={500} size={rem(13)}>
              {item.incidentType}
            </Text>
          </Center>
        </Table.Td>
      </Table.Tr>
    ))
  );

  useEffect(() => {
    if (interactionList) {
      scrollIntoView({});
    }
  }, [interactionList]);

  useEffect(() => {
    if (selectedInteractionItem) {
      scrollIntoInteractionDetail();
    }
  }, [selectedInteractionItem]);

  return (
    <Flex px={rem(28)} pt={rem(12)} bg={"#fff"} flex={1} direction={"column"}>
      <Text
        size={rem(26)}
        fw={700}
        my={rem(20)}
        c={"light-blue.4"}
        mb={rem(32)}
      >
        Interaction report
      </Text>
      <Card
        pb={rem(40)}
        radius={8}
        style={{
          border: "1px solid rgb(229 231 235)",
        }}
      >
        <Card.Section
          style={{
            borderBottom: "1px solid #ccc",
          }}
          bg={"#f9fafb"}
          py={rem(16)}
          px={rem(24)}
        >
          <Group justify="space-between">
            <Text size="md" fw={600}>
              Interaction chart
            </Text>
            <Group>
              <Box miw={rem(360)}>
                <EditAndUpdateForm fields={fields} />
              </Box>
            </Group>
          </Group>
        </Card.Section>

        <Card.Section px={rem(12)}>
          {!incidentReportByTimeData ||
          incidentReportByTimeData?.data?.length == 0 ? (
            <NoImage type="NO_DATA" />
          ) : (
            <Box>
              <Group justify="flex-end" mt={rem(20)} mb={rem(6)}>
                <LegendCard
                  type={LEGEND_TYPES.BAR}
                  color="rgba(255, 99, 132, 1)"
                  title="Total interaction"
                />
                <LegendCard
                  type={LEGEND_TYPES.LINE}
                  color="rgb(37, 150, 190)"
                  title="Average interaction time"
                />
              </Group>
              <Flex>
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
                          label: "Total interactions",
                          data: data?.map((i) => i.count),
                          borderColor: "rgb(37, 150, 190)",
                          backgroundColor: "rgb(37, 150, 190, 0.5)",
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
                            setSelectedInteractionItem(null);
                            setSelectedDuration({
                              startTime: selectedData?.time,
                              endTime: addDaysBaseOnReportInterval(
                                selectedData?.time,
                                form.values.interval
                              ),
                            });
                          }
                        },
                      }}
                      data={{
                        labels: data?.map((i) => i.time),

                        datasets: [
                          {
                            type: "line" as const,
                            label: "Average duration ",
                            data: data?.map((i) => i.avarageDuration),
                            borderColor: "rgb(37, 150, 190)",
                            backgroundColor: "rgb(37, 150, 190, 0.5)",
                            cubicInterpolationMode: "monotone",
                            pointHoverRadius: 7,
                            pointHoverBackgroundColor: "#fff",
                            pointBackgroundColor: "rgb(37, 150, 190)",
                            borderWidth: 2,
                            pointRadius: 3,
                            fill: false,
                            pointHitRadius: 7,
                          },
                          {
                            type: "bar" as const,
                            label: "Total interactions",
                            data: data?.map((i) => i.count),
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",

                            borderWidth: {
                              bottom: 0,
                              left: 2,
                              right: 2,
                              top: 2,
                            },
                            borderRadius: {
                              topRight: 5,
                              topLeft: 5,
                            },

                            borderSkipped: false,
                          },
                        ],
                      }}
                    />
                  </Box>
                </Box>
              </Flex>
            </Box>
          )}
        </Card.Section>
      </Card>

      <Group align="flex-start" mt={rem(40)}>
        {interactionList ? (
          <Card
            radius={8}
            w={"100%"}
            mb={rem(80)}
            ref={targetRef}
            style={{
              border: "1px solid #ccc",
            }}
          >
            <Card.Section
              style={{
                borderBottom: "1px solid #ccc",
              }}
              bg={"#f9fafb"}
              py={rem(16)}
              px={rem(12)}
            >
              <Group justify="space-between">
                <Text size="md" fw={600}>
                  Interaction list
                </Text>
                <Group gap={rem(6)}>
                  <Text fw={500} size="sm">
                    From
                  </Text>
                  <Badge
                    radius={"sm"}
                    color={"green"}
                    style={{
                      border: "1px solid green",
                    }}
                    variant="light"
                    c={"#000"}
                    mr={rem(10)}
                  >
                    {dayjs(selectedDuration?.startTime).format("HH:mm | DD-MM")}
                  </Badge>
                  <Text fw={500} size="sm">
                    to
                  </Text>
                  <Badge
                    radius={"sm"}
                    color={"green"}
                    style={{
                      border: "1px solid green",
                    }}
                    variant="light"
                    c={"#000"}
                    mr={rem(16)}
                  >
                    {dayjs(selectedDuration?.endTime).format("HH:mm DD-MM")}
                  </Badge>
                </Group>
              </Group>
            </Card.Section>
            <Card.Section>
              <ScrollArea.Autosize
                mah={700}
                onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
              >
                <Table striped highlightOnHover withColumnBorders>
                  <Table.Thead
                    className={cx(classes.header, {
                      [classes.scrolled]: scrolled,
                    })}
                  >
                    <Table.Tr>
                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text
                            size={rem(13)}
                            lh={rem(24)}
                            c={"rgb(55 65 81)"}
                            fw={600}
                          >
                            Index
                          </Text>
                        </Center>
                      </Table.Th>
                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text
                            size={rem(13)}
                            lh={rem(24)}
                            c={"rgb(55 65 81)"}
                            fw={600}
                          >
                            Start time
                          </Text>
                        </Center>
                      </Table.Th>
                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text
                            size={rem(13)}
                            lh={rem(24)}
                            c={"rgb(55 65 81)"}
                            fw={600}
                          >
                            End time
                          </Text>
                        </Center>
                      </Table.Th>
                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text
                            size={rem(13)}
                            lh={rem(24)}
                            c={"rgb(55 65 81)"}
                            fw={600}
                          >
                            Evidences
                          </Text>
                        </Center>
                      </Table.Th>
                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text
                            size={rem(13)}
                            lh={rem(24)}
                            c={"rgb(55 65 81)"}
                            fw={600}
                          >
                            Type
                          </Text>
                        </Center>
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </ScrollArea.Autosize>
            </Card.Section>
          </Card>
        ) : (
          <></>
        )}

        {selectedInteractionItem ? (
          <Card
            radius={8}
            w={"100%"}
            ref={interactionDetailRef}
            style={{
              border: "1px solid rgb(229 231 235)",
            }}
          >
            <Card.Section>
              <Box
                style={{
                  borderBottom: "1px solid #ccc",
                }}
                bg={"#f9fafb"}
                py={rem(16)}
                px={rem(24)}
              >
                <Group justify="space-between">
                  <Text size="md" fw={600}>
                    Interaction detail
                  </Text>
                  <Group gap={rem(8)}>
                    <Text fw={500} size="sm">
                      Total time:
                    </Text>
                    <Badge
                      radius={"sm"}
                      color={"green"}
                      c={"#fff"}
                      mr={rem(16)}
                    >
                      {selectedInteractionItem?.startTime &&
                      selectedInteractionItem.endTime
                        ? differentDateReturnFormattedString(
                            selectedInteractionItem?.startTime,
                            selectedInteractionItem?.endTime
                          )
                        : "undefined"}
                    </Badge>
                  </Group>
                </Group>
              </Box>

              <ScrollArea.Autosize mah={1000} my={rem(12)}>
                <Box px={rem(24)}>
                  <Box>
                    <Group
                      justify="space-between"
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                      }}
                      pb={rem(8)}
                      mb={rem(10)}
                    >
                      <Text
                        c={"rgb(107 114 128"}
                        size={rem(14)}
                        lh={rem(24)}
                        fw={500}
                      >
                        {dayjs(
                          selectedInteractionItem?.evidences?.[0]?.createdDate
                        ).format("LL")}
                      </Text>
                    </Group>
                    {selectedInteractionItem?.evidences?.length == 0 ? (
                      <NoImage type="NO_DATA" />
                    ) : (
                      selectedInteractionItem?.evidences.map((i) => (
                        <LoadingImage
                          fit="contain"
                          radius={"md"}
                          mb={rem(12)}
                          key={i.id}
                          imageId={i?.imageId ?? ""}
                        />
                      ))
                    )}
                  </Box>
                </Box>
              </ScrollArea.Autosize>
            </Card.Section>
          </Card>
        ) : (
          <></>
        )}
      </Group>
    </Flex>
  );
};
