import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Select,
  SimpleGrid,
  Skeleton,
  Table,
  Text,
  rem,
} from "@mantine/core";
import cx from "clsx";

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { NotificationColorPalette } from "../../types/constant";
import classes from "./ShopCalendar.module.scss";
import clsx from "clsx";
import {
  IconCalendarTime,
  IconChevronLeft,
  IconChevronRight,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { useScrollIntoView } from "@mantine/hooks";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import dayjs from "dayjs";
import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import { IncidentDetail } from "../../models/Incident";
import { differentDateReturnFormattedString } from "../../utils/helperFunction";
import NoImage from "../../components/image/NoImage";
import LoadingImage from "../../components/image/LoadingImage";
import { useAssignSupervisor } from "../../hooks/useAssignSupervisor";
import { Role } from "../../models/CamAIEnum";
import { notifications } from "@mantine/notifications";
import { useGetSupervisorAssignmentHistory } from "../../hooks/useGetSupervisorAssignment";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface Event {
  date: Date;
  title: string;
}

interface ShopCalendarProps {
  events: Event[];
}

const ShopCalendar = ({ events }: ShopCalendarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const {
    scrollIntoView: scrollIntoIncidentDetail,
    targetRef: incidentDetailRef,
  } = useScrollIntoView<HTMLDivElement>();
  const [selectedIncidentItem, setSelectedIncidentItem] =
    useState<IncidentDetail | null>(null);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { mutate: assignHeadSuperVisor } = useAssignSupervisor();

  const { data: incidentList, isLoading: isGetIncidentListLoading } =
    useGetIncidentList({
      enabled: true,
      fromTime: "2024-04-10T00:00:00",
      toTime: "2024-04-16T00:00:00",
    });

  const { data: employeeList, isLoading: isEmployeeListLoading } =
    useGetEmployeeList({ size: 999 });

  const { data, isLoading } = useGetSupervisorAssignmentHistory({
    date: dayjs(selectedDate ?? new Date()).format("YYYY-MM-DD"),
  });

  console.log({ data, isLoading });

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);
  const endDayIndex = getDay(lastDayOfMonth);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc: { [key: string]: Event[] }, event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {});
  }, [events]);

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

  const handleSetSuperVisor = ({
    id,
    role,
  }: {
    id: string;
    role: Role.ShopHeadSupervisor | Role.ShopSupervisor;
  }) => {
    if (role == Role.ShopHeadSupervisor) {
      assignHeadSuperVisor(
        { accountId: id, role },
        {
          onSuccess() {
            notifications.show({
              title: "Success",
              message: "Assign head supervisor successfully!",
              autoClose: 6000,
              c: NotificationColorPalette.UP_COMING,
            });
          },
          onError() {
            notifications.show({
              title: "Failed",
              message: "Assign head supervisor failed!",
              autoClose: 6000,
              c: NotificationColorPalette.ALERT_MESSAGE,
            });
          },
        }
      );
    }
  };

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
    <>
      <Flex
        px={rem(60)}
        pt={rem(20)}
        bg={"#fff"}
        flex={1}
        pb={rem(40)}
        direction={"column"}
      >
        <Text
          size={rem(24)}
          fw={700}
          my={rem(20)}
          c={"light-blue.4"}
          mb={rem(28)}
        >
          Supervisor calendar
        </Text>

        <Group align="flex-start" gap={rem(60)}>
          <Box flex={4}>
            <Group>
              {isEmployeeListLoading ? (
                <Loader />
              ) : (
                <>
                  <Select
                    flex={1}
                    radius={rem(8)}
                    style={{
                      fontWeight: 500,
                    }}
                    onChange={(id) => {
                      handleSetSuperVisor({
                        id: id ?? "",
                        role: Role.ShopHeadSupervisor,
                      });
                    }}
                    searchable
                    nothingFoundMessage="Nothing found..."
                    styles={{
                      label: {
                        marginBottom: rem(4),
                      },
                    }}
                    label="Head supervisor"
                    data={employeeList?.values?.map((i) => {
                      return { value: i.id, label: i.name };
                    })}
                  />
                  <Select
                    flex={1}
                    radius={rem(8)}
                    style={{
                      fontWeight: 500,
                    }}
                    nothingFoundMessage="Nothing found..."
                    styles={{
                      label: {
                        marginBottom: rem(4),
                      },
                    }}
                    searchable
                    label="In charge supervisor"
                    data={employeeList?.values?.map((i) => {
                      return { value: i.id, label: i.name };
                    })}
                  />
                </>
              )}
            </Group>

            <Accordion
              variant="contained"
              radius="md"
              mt={rem(12)}
              disableChevronRotation
              chevron={<IconChevronRight />}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Accordion.Item key={i} value={i.toString()}>
                  <Accordion.Control>
                    <Group
                      key={i}
                      justify="space-between"
                      py={rem(8)}
                      px={rem(12)}
                    >
                      <Box>
                        <Text
                          c={"rgb(17, 24, 39)"}
                          lh={rem(26)}
                          fw={500}
                          size={rem(16)}
                          mb={rem(4)}
                        >
                          Nguyen Quang Huy
                        </Text>
                        <Group gap={0}>
                          <IconCalendarTime
                            style={{
                              width: rem(20),
                              aspectRatio: 1,
                            }}
                            color={"rgb(107, 114, 128)"}
                          />

                          <Text
                            ml={rem(10)}
                            c={"rgb(107, 114, 128)"}
                            lh={rem(26)}
                            size={rem(14)}
                          >
                            {format(
                              selectedDate ?? new Date(),
                              "MMMM do, yyyy "
                            )}
                            from 11:00 AM to 2:00 PM
                          </Text>
                          <Divider
                            mx={rem(16)}
                            color="rgb(107,114,128,.5)"
                            orientation="vertical"
                          />
                          <IconExclamationCircle
                            style={{
                              width: rem(20),
                              aspectRatio: 1,
                            }}
                            color={"#c92a2a"}
                          />
                          <Text
                            ml={rem(10)}
                            c={"#c92a2a"}
                            lh={rem(26)}
                            size={rem(14)}
                          >
                            20 incident(s)
                          </Text>
                        </Group>
                      </Box>
                    </Group>
                  </Accordion.Control>
                </Accordion.Item>
              ))}
            </Accordion>
          </Box>

          <Box flex={3}>
            <Box pb={rem(12)}>
              <Group justify="space-between" align="center">
                <Text size={rem(17)} fw={600}>
                  {format(currentDate, "MMMM yyy")}
                </Text>

                <Group gap={rem(4)}>
                  <ActionIcon
                    variant="subtle"
                    aria-label="Settings"
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setCurrentDate(newDate);
                    }}
                  >
                    <IconChevronLeft color="rgb(107, 114, 128" />
                  </ActionIcon>
                  <Button
                    variant="subtle"
                    color="#000"
                    onClick={() => {
                      setCurrentDate(new Date());
                      setSelectedDate(new Date());
                    }}
                  >
                    <Text size={rem(16)} fw={600}>
                      Today
                    </Text>
                  </Button>

                  <ActionIcon
                    variant="subtle"
                    aria-label="Settings"
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setCurrentDate(newDate);
                    }}
                  >
                    <IconChevronRight color="rgb(107, 114, 128" />
                  </ActionIcon>
                </Group>
              </Group>
            </Box>

            <Box>
              <SimpleGrid cols={7} spacing={0} style={{}}>
                {WEEKDAYS.map((day, i) => {
                  return (
                    <Box py={rem(8)} key={day + i}>
                      <Text
                        key={day}
                        c={"rgb(55 65 81)"}
                        size={rem(14)}
                        lh={rem(24)}
                        ta={"center"}
                        fw={600}
                      >
                        {day}
                      </Text>
                    </Box>
                  );
                })}
              </SimpleGrid>
              <SimpleGrid
                cols={7}
                spacing={0}
                style={{
                  borderRadius: rem(10),
                  overflow: "hidden",
                  borderTop: "1px solid #ccc",
                  borderRight: "1px solid #ccc",
                }}
              >
                {Array.from({ length: startingDayIndex }).map((_, index) => {
                  return (
                    <Box
                      key={`empty-${index}`}
                      style={{
                        borderBottom: "1px solid #ccc",
                        borderLeft: "1px solid #ccc",
                      }}
                      py={rem(8)}
                      ta={"center"}
                    />
                  );
                })}
                {daysInMonth.map((day, index) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const todaysEvents = eventsByDate[dateKey] || [];

                  return (
                    <Box
                      key={index}
                      py={rem(12)}
                      ta={"center"}
                      className={
                        isToday(day)
                          ? clsx(classes.today, classes.activeCard)
                          : dayjs(day).isSame(selectedDate, "day")
                          ? clsx(classes.selectedDay, classes.activeCard)
                          : classes["activeCard"]
                      }
                      onClick={() => setSelectedDate(day)}
                    >
                      <Text c={"rgb(55, 65, 81)"} size={rem(12)} lh={rem(48)}>
                        {format(day, "d")}
                      </Text>
                      {todaysEvents.map((event) => {
                        return (
                          <Box
                            key={event.title}
                            bg={NotificationColorPalette.UP_COMING}
                          >
                            <Text c={"gray.9"}>{event.title}</Text>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })}

                {Array.from({ length: 6 - endDayIndex }).map((_, index) => {
                  return (
                    <Box
                      key={`empty-${index}`}
                      style={{
                        borderBottom: "1px solid #ccc",
                        borderLeft: "1px solid #ccc",
                      }}
                      py={rem(8)}
                      ta={"center"}
                    />
                  );
                })}
              </SimpleGrid>
            </Box>
          </Box>
        </Group>

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
                  <Text size="md" fw={600} ml={rem(12)}>
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
                      {/* {dayjs(selectedDuration?.startTime).format("HH:mm | DD-MM")} */}
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
                      {/* {dayjs(selectedDuration?.endTime).format("HH:mm DD-MM")} */}
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
                            {selectedIncidentItem?.employee?.name ?? "(Empty)"}
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
      </Flex>
    </>
  );
};

export default ShopCalendar;
