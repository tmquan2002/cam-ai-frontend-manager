import {
  Badge,
  Box,
  Card,
  Center,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Select,
  Skeleton,
  Table,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";

import { Chart } from "react-chartjs-2";
import { IncidentType, ReportInterval } from "../../../../models/CamAIEnum";
import NoImage from "../../../../components/image/NoImage";
import { useForm } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import _ from "lodash";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../../../components/form/EditAndUpdateForm";
import { useGetShopList } from "../../../../hooks/useGetShopList";
import { useGetIncidentList } from "../../../../hooks/useGetIncidentList";
import { IncidentDetail } from "../../../../models/Incident";
import { useScrollIntoView } from "@mantine/hooks";
import classes from "./InteractionReportPAgeManager.module.scss";
import clsx from "clsx";
import {
  addDaysBaseOnReportInterval,
  differentDateReturnFormattedString,
  makeDivisibleByDivider,
} from "../../../../utils/helperFunction";
import LoadingImage from "../../../../components/image/LoadingImage";
import { useGetShopHumanCountReportByShopId } from "../../../../hooks/useGetHumanCountReportByShopId";
import { GetShopHumanCountReportByShopIdParams } from "../../../../apis/ReportAPI";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);
type SearchIncidentField = {
  startDate?: Date;
  toDate?: Date;
  interval: ReportInterval;
};
const InteractionReportPageManager = () => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const { data: shopList, isLoading: isGetShopListLoading } = useGetShopList({
    enabled: true,
    size: 999,
  });

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const [scrolled, setScrolled] = useState(false);
  const {
    scrollIntoView: scrollIntoInteractionDetail,
    targetRef: interactionDetailRef,
  } = useScrollIntoView<HTMLDivElement>();
  const [selectedShop, setSelectedShop] = useState<string | null>(null);

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

  const searchParams: GetShopHumanCountReportByShopIdParams & {
    enabled: boolean;
  } = useMemo(() => {
    if (form.isValid() && form.values.startDate && form.values.toDate) {
      let sb: GetShopHumanCountReportByShopIdParams & { enabled: boolean } = {
        startDate: form.values.startDate
          ? dayjs(form.values.startDate).format("YYYY-MM-DD")
          : undefined,
        endDate: form.values.toDate
          ? dayjs(form.values.toDate).format("YYYY-MM-DD")
          : undefined,
        interval: form.values.interval,
        enabled: true,
        shopId: selectedShop ?? "",
      };
      sb = _.omitBy(sb, _.isNil) as GetShopHumanCountReportByShopIdParams & {
        enabled: boolean;
      };
      return sb;
    } else {
      return {
        enabled: true,
        interval: form.values.interval,
        shopId: selectedShop ?? "",
      };
    }
  }, [
    form.values.interval,
    form.values.startDate,
    form.values.toDate,
    selectedShop,
  ]);

  const {
    data: incidentReportByTimeData,
    isLoading: isGetIncidentReportByTimeDataLoading,
  } = useGetShopHumanCountReportByShopId(searchParams);

  const { data: interactionList, isLoading: isGetInteractionListLoading } =
    useGetIncidentList({
      enabled: !!selectedDuration && !!selectedShop,
      fromTime: selectedDuration?.startTime,
      toTime: selectedDuration?.endTime,
      incidentType: IncidentType.Interaction,
      size: 999,
      shopId: selectedShop ?? "",
    });

  const data = useMemo(() => {
    if (isGetIncidentReportByTimeDataLoading) {
      return [];
    }
    return incidentReportByTimeData?.data.map((item) => {
      return {
        time: dayjs(item.time).format("HH:mm DD-MM"),
        humanCount: item.humanCount.high,
        averageInteractionDuration: item?.interaction.averageDuration,
        interactionCount: item?.interaction.count,
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
            <Text size={rem(13)} fw={500}>
              {index + 1}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text size={rem(13)} fw={500}>
              {item?.startTime
                ? dayjs(item.startTime).format("HH:mm | DD-MM")
                : "Empty"}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text size={rem(13)} fw={500}>
              {item?.endTime
                ? dayjs(item.endTime).format("HH:mm | DD-MM")
                : "Empty"}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text size={rem(13)} fw={500}>
              {item.evidences.length}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text size={rem(13)} fw={500}>
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
    <Box
      px={rem(40)}
      flex={1}
      pt={rem(20)}
      bg={computedColorScheme == "light" ? "#fff" : "#1a1a1a"}
    >
      <Group align="center" my={rem(20)} justify="space-between">
        <Text size="lg" fw={"bold"} fz={22} c={"light-blue.4"}>
          Interaction Report
        </Text>
        {isGetShopListLoading ? (
          <Loader />
        ) : (
          <Select
            value={selectedShop}
            onChange={(value) => {
              setSelectedShop(value);
              setSelectedDuration(null);
              setSelectedInteractionItem(null);
            }}
            size="sm"
            radius={rem(8)}
            allowDeselect={false}
            w={rem(320)}
            style={{
              fontWeight: 500,
            }}
            styles={{
              dropdown: {
                fontWeight: 500,
              },
            }}
            data={
              shopList
                ? shopList?.values.map((item) => {
                    return {
                      value: item?.id,
                      label: item?.name,
                    };
                  })
                : []
            }
            placeholder={"Select a shop"}
          />
        )}
      </Group>

      <Box
        pb={rem(20)}
        bg={computedColorScheme == "light" ? "white" : "#242424"}
      >
        {!selectedShop ? (
          <Text size="md" fw={500} ta="center">
            No Shop Selected
          </Text>
        ) : (
          <>
            <Skeleton visible={isGetIncidentReportByTimeDataLoading}>
              {!incidentReportByTimeData ||
              incidentReportByTimeData?.data?.length == 0 ? (
                <NoImage type="NO_DATA" />
              ) : (
                <Card
                  pb={rem(40)}
                  radius={8}
                  style={{
                    border: "1px solid #ccc",
                  }}
                  bg={computedColorScheme == "light" ? "white" : "#1a1a1a"}
                >
                  <Card.Section
                    style={{
                      borderBottom: "1px solid #ccc",
                      backgroundColor: "#f9fafb",
                    }}
                    py={rem(16)}
                    px={rem(24)}
                  >
                    <Group justify="flex-end">
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
                      <Box mt={rem(12)}>
                        <NoImage type="NO_DATA" />
                      </Box>
                    ) : (
                      <Box>
                        <Group justify="flex-end" mt={rem(20)} mb={rem(6)}>
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
                              c={
                                computedColorScheme == "dark"
                                  ? `white`
                                  : `black`
                              }
                            >
                              Total interaction
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
                              c={
                                computedColorScheme == "dark"
                                  ? `white`
                                  : `black`
                              }
                            >
                              Total employee
                            </Text>
                          </Group>
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
                                      color: "#000",
                                    },
                                    suggestedMax: 8,
                                    max: makeDivisibleByDivider(
                                      _.maxBy(data, function (o) {
                                        return o.interactionCount;
                                      })?.interactionCount ?? 6,
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
                                datasets: [
                                  {
                                    label: "Total interaction",
                                    data: data?.map((i) => i.interactionCount),
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
                                      width: `${
                                        1500 + (data?.length - 7) * 70
                                      }px`,
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
                                          return o.interactionCount;
                                        })?.interactionCount ?? 6,
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
                                      max: 6,
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
                                      label: "Total interaction",
                                      data: data?.map(
                                        (i) => i.interactionCount
                                      ),
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
                                      label: "Total employee",
                                      data: data?.map((i) => i.humanCount),

                                      borderColor: "rgb(255, 99, 132)",
                                      backgroundColor:
                                        "rgba(255, 99, 132, 0.5)",

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
                                      yAxisID: "y1",

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
              )}
            </Skeleton>

            <Group align="flex-start" mt={rem(40)}>
              {interactionList ? (
                <Card
                  radius={8}
                  w={"100%"}
                  mb={rem(20)}
                  ref={targetRef}
                  style={{
                    border: "1px solid #ccc",
                  }}
                  bg={computedColorScheme == "light" ? "white" : "#1a1a1a"}
                >
                  <Card.Section
                    style={{
                      borderBottom: "1px solid #ccc",
                      backgroundColor: "#f9fafb",
                    }}
                    py={rem(16)}
                    px={rem(12)}
                  >
                    <Group justify="space-between">
                      <Text size="md" fw={600} ml={10}>
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
                          mr={rem(10)}
                        >
                          {dayjs(selectedDuration?.startTime).format(
                            "HH:mm | DD-MM"
                          )}
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
                          {dayjs(selectedDuration?.endTime).format(
                            "HH:mm DD-MM"
                          )}
                        </Badge>
                      </Group>
                    </Group>
                  </Card.Section>
                  <Card.Section>
                    <ScrollArea
                      mah={700}
                      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
                    >
                      <Table striped highlightOnHover>
                        <Table.Thead
                          className={clsx(classes.header, {
                            [classes.scrolled]: scrolled,
                          })}
                        >
                          <Table.Tr>
                            <Table.Th py={rem(16)}>
                              <Center>
                                <Text size={rem(13)} lh={rem(24)} fw={600}>
                                  Index
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
                                  Type
                                </Text>
                              </Center>
                            </Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                      </Table>
                    </ScrollArea>
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
                    border: "1px solid #ccc",
                  }}
                  bg={computedColorScheme == "light" ? "white" : "#1a1a1a"}
                >
                  <Card.Section>
                    <Box
                      style={{
                        borderBottom: "1px solid #ccc",
                        backgroundColor: "#f9fafb",
                      }}
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
                          <Badge radius={"sm"} color={"green"} c={"#fff"}>
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
                            <Text size={rem(14)} lh={rem(24)} fw={500}>
                              {dayjs(
                                selectedInteractionItem?.evidences?.[0]
                                  ?.createdDate
                              ).format("LL")}
                            </Text>
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
                                {selectedInteractionItem?.aiId ?? "(Empty)"}
                              </Text>
                            </Text>
                          </Group>
                          {selectedInteractionItem?.evidences?.length == 0 ? (
                            <NoImage type="NO_DATA" />
                          ) : (
                            selectedInteractionItem?.evidences.map((i) => (
                              <Center>
                                <LoadingImage
                                  radius={"md"}
                                  mb={rem(12)}
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
          </>
        )}
      </Box>
    </Box>
  );
};

export default InteractionReportPageManager;
