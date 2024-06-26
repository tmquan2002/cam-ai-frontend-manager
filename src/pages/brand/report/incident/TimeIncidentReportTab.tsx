import {
  Badge,
  Box,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { GetIncidentReportByTimeParams } from "../../../../apis/IncidentAPI";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../../../components/form/EditAndUpdateForm";
import NoImage from "../../../../components/image/NoImage";
import { useGetIncidentReportByTime } from "../../../../hooks/useGetIncidentReportByTime";
import {
  IncidentStatus,
  IncidentType,
  ReportInterval,
} from "../../../../models/CamAIEnum";

import { DonutChart } from "@mantine/charts";
import { useScrollIntoView } from "@mantine/hooks";
import { Chart } from "react-chartjs-2";
import LegendCard, {
  LEGEND_TYPES,
} from "../../../../components/card/LegendCard";
import LoadingImage from "../../../../components/image/LoadingImage";
import { useGetIncidentList } from "../../../../hooks/useGetIncidentList";
import { useGetIncidentPercent } from "../../../../hooks/useGetIncidentPercent";
import {
  IncidentDetail,
  IncidentPercentStatusDetail,
  IncidentPercentTypeDetail,
} from "../../../../models/Incident";
import {
  addDaysBaseOnReportInterval,
  differentDateReturnFormattedString,
  makeDivisibleByDivider,
} from "../../../../utils/helperFunction";
import classes from "./TimeIncidentReport.module.scss";

import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

export type TimeIncidentReportTabProps = {
  shopId: string | null;
};

type SearchIncidentField = {
  startDate?: Date;
  toDate?: Date;
  interval: ReportInterval;
  type: IncidentType;
};

const renderIncidentStatusLegendTitle = (
  details: IncidentPercentStatusDetail[],
  status: IncidentStatus
) => {
  const detail = details.find((i) => i.status == status);

  return `${status} incident (${detail?.total}) - ${(detail?.percent
    ? detail.percent * 100
    : 0
  ).toFixed(2)}%`;
};

const renderIncidentTypeLegendTitle = (
  details: IncidentPercentTypeDetail[],
  type: IncidentType
) => {
  const detail = details.find((i) => i.type == type);

  return `${type} incident (${detail?.total}) - ${(detail?.percent
    ? detail.percent * 100
    : 0
  ).toFixed(2)}%`;
};

const TimeIncidentReportTab = ({ shopId }: TimeIncidentReportTabProps) => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const {
    scrollIntoView: scrollIntoIncidentDetail,
    targetRef: incidentDetailRef,
  } = useScrollIntoView<HTMLDivElement>();
  const [selectedIncidentItem, setSelectedIncidentItem] =
    useState<IncidentDetail | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<{
    startTime: string;
    endTime: string;
  } | null>({
    startTime: dayjs(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)).format(
      "YYYY-MM-DD"
    ),
    endTime: dayjs().format("YYYY-MM-DD"),
  });

  const form = useForm<SearchIncidentField>({
    validateInputOnChange: true,
    initialValues: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      toDate: new Date(),
      interval: ReportInterval.HalfDay,
      type: IncidentType.Incident,
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
          type: form.values.type,
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
          type: form.values.type,
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
          type: form?.values.type,
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

  const { data: incidentPercent, isLoading: isGetIncidentPercentLoading } =
    useGetIncidentPercent({
      startDate: form.values.startDate
        ? dayjs(form.values.startDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      endDate: form.values.startDate
        ? dayjs(form.values.toDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      enabled: !!shopId,
      shopId: shopId ?? "",
      type: form.values.type,
    });

  const { data: incidentList, isLoading: isGetIncidentListLoading } =
    useGetIncidentList({
      enabled:
        !!selectedDuration?.startTime &&
        !!selectedDuration?.endTime &&
        !!shopId,
      fromTime: selectedDuration?.startTime,
      toTime: selectedDuration?.endTime,
      size: 999,
      shopId: shopId,
      incidentType: form.values.type,
    });

  const data = useMemo(() => {
    if (isGetIncidentReportByTimeDataLoading) {
      return [];
    }
    return incidentReportByTimeData?.data.map((item) => {
      return {
        time: dayjs(item.time).format("HH:mm DD-MM"),
        count: item.count,
        duration: item.averageDuration,
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
        spans: 3,
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
        spans: 3,
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
        spans: 3,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          form,
          name: "type",
          placeholder: "Incident type",
          fontWeight: 500,
          radius: rem(8),

          data: [
            {
              value: IncidentType.Phone,
              label: "Phone incident",
            },
            {
              value: IncidentType.Uniform,
              label: "Uniform incident",
            },
            {
              value: IncidentType.Incident,
              label: "All incident",
            },
          ],
        },
        spans: 3,
      },
    ];
  }, [form]);

  useEffect(() => {
    if (incidentList) {
      scrollIntoView();
    }
  }, [incidentList]);
  useEffect(() => {
    if (selectedIncidentItem) {
      scrollIntoIncidentDetail();
    }
  }, [selectedIncidentItem]);

  const rows = isGetIncidentListLoading ? (
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
      <Table.Td py={rem(18)}>
        <Skeleton w={"100%"} h={rem(40)} />
      </Table.Td>
    </Table.Tr>
  ) : (
    incidentList?.values.map((item, index) => (
      <Table.Tr
        key={index}
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          setSelectedIncidentItem(item);
        }}
        className={
          item?.id == selectedIncidentItem?.id
            ? classes["selectedInteraction"]
            : ""
        }
      >
        <Table.Td>
          <Center>
            <Text size={rem(13)}>{item.incidentType}</Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text size={rem(13)}>
              {item?.startTime
                ? dayjs(item.startTime).format("HH:mm | DD-MM")
                : "Empty"}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text size={rem(13)}>
              {item?.endTime
                ? dayjs(item.endTime).format("HH:mm | DD-MM")
                : "Empty"}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text size={rem(13)}>{item?.evidences.length}</Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text size={rem(13)} fw={500}>
              {item?.assignment?.supervisor?.name ?? "Empty"}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text size={rem(13)}>{item?.employee?.name ?? "Empty"}</Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text fw={500} size={rem(13)}>
              {item.status}
            </Text>
          </Center>
        </Table.Td>
      </Table.Tr>
    ))
  );

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
            py={rem(20)}
            style={{
              borderBottom: "1px solid #ccc",
            }}
            bg={"#f9fafb"}
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
                <Group gap={"sm"} align="center">
                  <Box
                    style={{
                      borderRadius: "999px",
                      width: rem(20),
                      aspectRatio: 5,
                      backgroundColor: "rgb(37, 150, 190)",
                    }}
                  />
                  <Text
                    size={rem(14)}
                    fw={500}
                    c={computedColorScheme == "dark" ? `white` : `black`}
                  >
                    Total incident
                  </Text>
                </Group>
                <Group gap={"sm"} align="center">
                  <Box
                    style={{
                      borderRadius: "2px",
                      width: rem(10),
                      aspectRatio: 1,
                      backgroundColor: "rgba(255, 99, 132, 1)",
                    }}
                  />
                  <Text
                    size={rem(14)}
                    fw={500}
                    c={computedColorScheme == "dark" ? `white` : `black`}
                  >
                    Average incident time
                  </Text>
                </Group>
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
                            count: 7,
                          },
                          beginAtZero: true,
                          afterFit: (ctx) => {
                            ctx.width = 39;
                          },
                          grid: {
                            drawTicks: false,
                          },
                          border: {
                            color: "grey",
                          },
                          suggestedMax: 8,
                          max: makeDivisibleByDivider(
                            _.maxBy(data, function (o) {
                              return o.count;
                            })?.count ?? 6,
                            6
                          ),
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
                      datasets: [],
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
                              count: 7,
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
                            max: makeDivisibleByDivider(
                              _.maxBy(data, function (o) {
                                return o.count;
                              })?.count ?? 6,
                              8
                            ),

                            suggestedMax: 8,
                          },
                          y1: {
                            suggestedMax: 6,
                            ticks: {
                              display: false,
                              count: 7,
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
                            max: makeDivisibleByDivider(
                              _.maxBy(data, function (o) {
                                return o.duration;
                              })?.duration ?? 6,
                              8
                            ),
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
                            setSelectedIncidentItem(null);
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
                            type: "line",
                            label: "Total incident ",
                            data: data?.map((i) => i.count),
                            borderColor: "rgb(37, 150, 190)",
                            cubicInterpolationMode: "monotone",
                            pointHoverRadius: 7,
                            pointHoverBackgroundColor: "#fff",
                            pointBackgroundColor: "rgb(37, 150, 190)",
                            borderWidth: 2,
                            pointRadius: 3,
                            fill: true,
                            pointHitRadius: 7,
                            yAxisID: "y",
                          },
                          {
                            type: "bar" as const,
                            label: "Average duration",
                            data: data?.map((i) => i.duration),
                            backgroundColor: "rgba(255, 99, 132, 0.6)",
                            borderColor: "rgba(255, 99, 132)",
                            borderRadius: 6,
                            yAxisID: "y1",
                          },
                        ],
                      }}
                    />
                  </Box>
                </Box>
              </Flex>

              {isGetIncidentPercentLoading ? (
                <Loader></Loader>
              ) : incidentPercent?.total != 0 ? (
                <SimpleGrid cols={2} px={rem(32)} mb={rem(32)} spacing={"xl"}>
                  <Box
                    flex={1}
                    style={{
                      borderRadius: rem(12),
                      border: "1px solid #ccc",
                    }}
                  >
                    <Text
                      py={rem(20)}
                      ta={"center"}
                      fw={500}
                      style={{
                        borderTopLeftRadius: rem(12),
                        borderTopRightRadius: rem(12),
                      }}
                      bg={"#f9fafb"}
                    >
                      Incident type ratio
                    </Text>
                    <Divider />
                    <Flex justify={"center"} mt={rem(12)}>
                      <DonutChart
                        withLabelsLine
                        withLabels
                        thickness={30}
                        data={
                          incidentPercent
                            ? incidentPercent?.types?.map((i) => {
                                return {
                                  name: i.type + " incident",
                                  color:
                                    i.type == IncidentType.Phone
                                      ? "indigo.6"
                                      : "yellow.6",
                                  value: i.total,
                                };
                              })
                            : []
                        }
                      />
                      <Stack mt={rem(52)} ml={rem(20)} gap={rem(16)}>
                        <LegendCard
                          color="#4c6ef5"
                          title={renderIncidentTypeLegendTitle(
                            incidentPercent?.types ?? [],
                            IncidentType.Phone
                          )}
                          type={LEGEND_TYPES.CIRCLE}
                        />
                        <LegendCard
                          color="#fab005"
                          title={renderIncidentTypeLegendTitle(
                            incidentPercent?.types ?? [],
                            IncidentType.Uniform
                          )}
                          type={LEGEND_TYPES.CIRCLE}
                        />
                      </Stack>
                    </Flex>
                  </Box>

                  <Box
                    flex={1}
                    style={{
                      borderRadius: rem(12),
                      border: "1px solid #ccc",
                    }}
                  >
                    <Text
                      py={rem(20)}
                      ta={"center"}
                      fw={500}
                      style={{
                        borderTopLeftRadius: rem(12),
                        borderTopRightRadius: rem(12),
                      }}
                      bg={"#f9fafb"}
                    >
                      Incident status ratio
                    </Text>
                    <Divider />
                    <Flex justify={"center"} mt={rem(12)}>
                      <DonutChart
                        withLabelsLine
                        withLabels
                        thickness={30}
                        data={
                          incidentPercent
                            ? incidentPercent?.statuses.map((i) => {
                                return {
                                  color:
                                    i.status == IncidentStatus.Accepted
                                      ? "#12b886"
                                      : i.status == IncidentStatus.New
                                      ? "#4c6ef5"
                                      : "#fa5252",
                                  name: i.status,
                                  value: i.total,
                                };
                              })
                            : []
                        }
                      />
                      <Stack mt={rem(52)} ml={rem(20)} gap={rem(16)}>
                        <LegendCard
                          color="#4c6ef5"
                          title={renderIncidentStatusLegendTitle(
                            incidentPercent?.statuses ?? [],
                            IncidentStatus.New
                          )}
                          type={LEGEND_TYPES.CIRCLE}
                        />
                        <LegendCard
                          color="#12b886"
                          title={renderIncidentStatusLegendTitle(
                            incidentPercent?.statuses ?? [],
                            IncidentStatus.Accepted
                          )}
                          type={LEGEND_TYPES.CIRCLE}
                        />
                        <LegendCard
                          color="#fa5252"
                          title={renderIncidentStatusLegendTitle(
                            incidentPercent?.statuses ?? [],
                            IncidentStatus.Rejected
                          )}
                          type={LEGEND_TYPES.CIRCLE}
                        />
                      </Stack>
                    </Flex>
                  </Box>
                </SimpleGrid>
              ) : (
                <></>
              )}
            </Box>
          )}
        </Box>
      </Skeleton>

      <Group align="flex-start" mt={rem(40)}>
        {incidentList ? (
          <Card
            radius={8}
            w={"100%"}
            mb={rem(40)}
            ref={targetRef}
            style={{
              border: "1px solid #ccc",
            }}
            bg={computedColorScheme == "light" ? "white" : "#1a1a1a"}
          >
            <Card.Section
              style={{
                borderBottom: "1px solid #ccc",
              }}
              py={rem(16)}
              px={rem(12)}
              bg={"#f9fafb"}
            >
              <Group justify="space-between">
                <Text size="md" fw={600} ml={rem(32)}>
                  Incident list
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
                    mr={rem(16)}
                  >
                    {dayjs(selectedDuration?.endTime).format("HH:mm DD-MM")}
                  </Badge>
                </Group>
              </Group>
            </Card.Section>

            <Card.Section>
              <ScrollArea.Autosize mah={700}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text size={rem(13)} lh={rem(24)} fw={600}>
                            Type
                          </Text>
                        </Center>
                      </Table.Th>
                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text size={rem(13)} lh={rem(24)} fw={600}>
                            Start time
                          </Text>
                        </Center>
                      </Table.Th>
                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text size={rem(13)} lh={rem(24)} fw={600}>
                            End time
                          </Text>
                        </Center>
                      </Table.Th>
                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text size={rem(13)} lh={rem(24)} fw={600}>
                            Evidences
                          </Text>
                        </Center>
                      </Table.Th>

                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text size={rem(13)} lh={rem(24)} fw={600}>
                            In charge
                          </Text>
                        </Center>
                      </Table.Th>

                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text size={rem(13)} lh={rem(24)} fw={600}>
                            Assigned to
                          </Text>
                        </Center>
                      </Table.Th>
                      <Table.Th py={rem(16)}>
                        <Center>
                          <Text size={rem(13)} lh={rem(24)} fw={600}>
                            Status
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
        {selectedIncidentItem ? (
          <Card
            radius={8}
            w={"100%"}
            ref={incidentDetailRef}
            style={{
              border: "1px solid rgb(229 231 235)",
            }}
            bg={computedColorScheme == "light" ? "white" : "#1a1a1a"}
          >
            <Card.Section>
              <Box
                style={{
                  borderBottom: "1px solid #ccc",
                }}
                py={rem(16)}
                px={rem(24)}
                bg={"#f9fafb"}
              >
                <Group justify="space-between">
                  <Text size="md" fw={600}>
                    Incident detail
                  </Text>
                  <Group gap={rem(8)}>
                    <Text fw={500} size="sm">
                      Total time:
                    </Text>
                    <Badge radius={"sm"} color={"green"} c={"#fff"}>
                      {selectedIncidentItem?.startTime &&
                      selectedIncidentItem.endTime
                        ? differentDateReturnFormattedString(
                            selectedIncidentItem?.startTime,
                            selectedIncidentItem?.endTime
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
                      pb={rem(12)}
                      mb={rem(12)}
                    >
                      <Text size={rem(14)} lh={rem(24)} fw={500}>
                        {dayjs(
                          selectedIncidentItem?.evidences?.[0]?.createdDate
                        ).format("LL")}
                      </Text>
                      <Group gap={rem(8)} align="center">
                        <Text size={rem(14)} lh={rem(24)} fw={500}>
                          Assigned to :{" "}
                          <Text
                            span
                            c="blue"
                            inherit
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {selectedIncidentItem?.employee?.name ?? "(Empty)"}
                          </Text>
                        </Text>
                        <Divider
                          orientation="vertical"
                          size={rem(2)}
                          color={"#ccc"}
                        />
                        <Text size={rem(14)} lh={rem(24)} fw={500}>
                          AI identify :{" "}
                          <Text
                            span
                            c="blue"
                            inherit
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {selectedIncidentItem?.aiId ?? "(Empty)"}
                          </Text>
                        </Text>
                      </Group>
                    </Group>
                    {selectedIncidentItem?.evidences?.length == 0 ? (
                      <NoImage type="NO_DATA" />
                    ) : (
                      selectedIncidentItem?.evidences.map((i) => (
                        <Center w={"100%"}>
                          <LoadingImage
                            mb={rem(12)}
                            radius={"md"}
                            key={i.id}
                            imageId={i?.imageId ?? ""}
                          />
                        </Center>
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
    </Box>
  );
};

export default TimeIncidentReportTab;
