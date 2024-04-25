import {
  Badge,
  Box,
  Card,
  Center,
  Flex,
  Group,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  Transition,
  rem,
} from "@mantine/core";
import { useGetIncidentReportByTime } from "../../../../hooks/useGetIncidentReportByTime";
import { IncidentType, ReportInterval } from "../../../../models/CamAIEnum";
import { useEffect, useMemo, useState } from "react";
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
import classes from "./TimeIncidentReport.module.scss";
import { Chart } from "react-chartjs-2";
import LegendCard, {
  LEGEND_TYPES,
} from "../../../../components/card/LegendCard";
import cx from "clsx";
import { useGetIncidentList } from "../../../../hooks/useGetIncidentList";
import {
  addDaysBaseOnReportInterval,
  differentDateReturnFormattedString,
} from "../../../../utils/helperFunction";
import { IncidentDetail } from "../../../../models/Incident";
import { useScrollIntoView } from "@mantine/hooks";
import LoadingImage from "../../../../components/image/LoadingImage";
import { DonutChart } from "@mantine/charts";

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
  type: IncidentType;
};

const TimeIncidentReport = () => {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const {
    scrollIntoView: scrollIntoIncidentDetail,
    targetRef: incidentDetailRef,
  } = useScrollIntoView<HTMLDivElement>();
  const [scrolled, setScrolled] = useState(false);
  const [selectedIncidentItem, setSelectedIncidentItem] =
    useState<IncidentDetail | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);

  const form = useForm<SearchIncidentField>({
    validateInputOnChange: true,
    initialValues: {
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
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
          type: form.values.type,
        };
      }
    }, [
      form.values.interval,
      form.values.startDate,
      form.values.toDate,
      form.values.type,
    ]);

  const {
    data: incidentReportByTimeData,
    isLoading: isGetIncidentReportByTimeDataLoading,
  } = useGetIncidentReportByTime(searchParams);

  const { data: incidentList, isLoading: isGetIncidentListLoading } =
    useGetIncidentList({
      enabled: !!selectedDuration?.startTime && !!selectedDuration?.endTime,
      fromTime: selectedDuration?.startTime,
      toTime: selectedDuration?.endTime,
    });

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
    </Table.Tr>
  ) : (
    incidentList?.values.map((item) => (
      <Table.Tr
        key={item.id}
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
            <Text c={"rgb(17 24 39"} fw={500} size={rem(13)}>
              {item.incidentType}
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
              {item?.evidences.length}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text c={"rgb(17 24 39"} fw={500} size={rem(13)}>
              {item?.employee?.name ?? "Empty"}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text c={"rgb(17 24 39"} fw={500} size={rem(13)}>
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
            bg={"#f9fafb"}
            py={rem(20)}
            style={{
              borderBottom: "1px solid #ccc",
            }}
          >
            <Group justify="flex-end">
              <Box miw={rem(360)} mr={rem(12)}>
                <EditAndUpdateForm fields={fields} />
              </Box>
            </Group>
          </Box>

          {!incidentReportByTimeData ||
          incidentReportByTimeData?.data?.length == 0 ? (
            <NoImage type="NO_DATA" />
          ) : (
            <Box>
              <Group justify="flex-end" mt={rem(20)} mb={rem(6)} mr={rem(12)}>
                <LegendCard
                  type="line"
                  color="rgba(255, 99, 132, 1)"
                  title="Total interaction"
                />
                <LegendCard
                  type="line"
                  color="rgb(37, 150, 190)"
                  title="Average interaction time"
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
                            type: "line" as const,
                            label: "Average duration ",
                            data: data?.map((i) => i.count),
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

              <SimpleGrid cols={2} px={rem(32)} mb={rem(32)} spacing={"xl"}>
                <Flex
                  justify={"center"}
                  flex={1}
                  style={{
                    borderRadius: rem(12),
                    border: "1px solid #ccc",
                  }}
                >
                  <DonutChart
                    withLabelsLine
                    withLabels
                    thickness={30}
                    data={[
                      { name: "India", value: 20, color: "yellow.6" },
                      { name: "Japan", value: 10, color: "teal.6" },
                      { name: "USA", value: 30, color: "indigo.6" },
                      { name: "Other", value: 20, color: "gray.6" },
                    ]}
                  />
                  <Stack mt={rem(40)} ml={rem(20)} gap={rem(16)}>
                    <LegendCard
                      color="#ccc"
                      title="Some thing"
                      type={LEGEND_TYPES.CIRCLE}
                    />
                    <LegendCard
                      color="#ccc"
                      title="Some thing"
                      type={LEGEND_TYPES.CIRCLE}
                    />
                    <LegendCard
                      color="#ccc"
                      title="Some thing"
                      type={LEGEND_TYPES.CIRCLE}
                    />
                    <LegendCard
                      color="#ccc"
                      title="Some thing"
                      type={LEGEND_TYPES.CIRCLE}
                    />
                  </Stack>
                </Flex>
                <Flex
                  flex={1}
                  justify={"center"}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: rem(12),
                  }}
                >
                  <DonutChart
                    withLabelsLine
                    withLabels
                    thickness={30}
                    data={[
                      { name: "India", value: 20, color: "yellow.6" },
                      { name: "Japan", value: 10, color: "teal.6" },
                      { name: "USA", value: 30, color: "indigo.6" },
                      { name: "Other", value: 20, color: "gray.6" },
                    ]}
                  />
                  <Stack mt={rem(40)} ml={rem(20)} gap={rem(16)}>
                    <LegendCard
                      color="#ccc"
                      title="Some thing"
                      type={LEGEND_TYPES.CIRCLE}
                    />
                    <LegendCard
                      color="#ccc"
                      title="Some thing"
                      type={LEGEND_TYPES.CIRCLE}
                    />
                    <LegendCard
                      color="#ccc"
                      title="Some thing"
                      type={LEGEND_TYPES.CIRCLE}
                    />
                    <LegendCard
                      color="#ccc"
                      title="Some thing"
                      type={LEGEND_TYPES.CIRCLE}
                    />
                  </Stack>
                </Flex>
              </SimpleGrid>
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
                            Type
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
                            Assigned to
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
                          selectedIncidentItem?.evidences?.[0]?.createdDate
                        ).format("LL")}
                      </Text>
                      <Text
                        c={"rgb(107 114 128"}
                        size={rem(14)}
                        lh={rem(24)}
                        fw={500}
                      >
                        Assigned to :{" "}
                        <Text
                          span
                          c="blue"
                          inherit
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {selectedIncidentItem?.employee?.name ?? "Empty"}
                        </Text>
                      </Text>
                    </Group>
                    {selectedIncidentItem?.evidences?.length == 0 ? (
                      <NoImage type="NO_DATA" />
                    ) : (
                      selectedIncidentItem?.evidences.map((i) => (
                        <LoadingImage
                          mb={rem(12)}
                          fit="contain"
                          radius={"md"}
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
    </Box>
  );
};

export default TimeIncidentReport;
