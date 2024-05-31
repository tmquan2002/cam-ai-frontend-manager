import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Collapse,
  Divider,
  Flex,
  Group,
  Loader,
  Popover,
  ScrollArea,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  rem,
  useComputedColorScheme,
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
import {
  DEFAULT_PAGE_SIZE,
  NotificationColorPalette,
} from "../../types/constant";
import classes from "./ShopCalendar.module.scss";
import clsx from "clsx";
import {
  IconBrandHipchat,
  IconCalendarTime,
  IconChevronLeft,
  IconChevronRight,
  IconExclamationCircle,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import {
  useClickOutside,
  useDisclosure,
  useScrollIntoView,
} from "@mantine/hooks";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import dayjs from "dayjs";
import { IncidentDetail } from "../../models/Incident";
import { differentDateReturnFormattedString } from "../../utils/helperFunction";
import NoImage from "../../components/image/NoImage";
import LoadingImage from "../../components/image/LoadingImage";
import { IncidentType, Role } from "../../models/CamAIEnum";
import { notifications } from "@mantine/notifications";
import { useGetSupervisorAssignmentHistory } from "../../hooks/useGetSupervisorAssignment";
import { modals } from "@mantine/modals";
import _ from "lodash";
import { SuperVisorAssignmentDetail } from "../../models/Shop";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import { useGetIncidentByAssignmentId } from "../../hooks/useGetIncidentByAssignmentId";
import { useAssignSupervisor } from "../../hooks/useAssignSupervisor";
import { useDeleteSupervisor } from "../../hooks/useDeleteSupervisor";
import { useAssignIncident } from "../../hooks/useAssignIncident";
import { useRejectIncidentById } from "../../hooks/useRejectIncidentById";
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface Event {
  date: Date;
  title: string;
}

interface ShopCalendarProps {
  events: Event[];
}

const renderInChargeRole = (role: Role | undefined | null) => {
  switch (role) {
    case Role.ShopHeadSupervisor:
    case Role.ShopSupervisor:
      return "Supervisor";
    case Role.Admin:
      return "Admin";
    case Role.BrandManager:
    case Role.ShopManager:
      return "Manager";
    case Role.SystemHandler:
      return "System";
    default:
      return "No role";
  }
};

const ShopCalendar = ({ events }: ShopCalendarProps) => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const [opened, { toggle }] = useDisclosure(false);
  const [scrolled, setScrolled] = useState(false);

  const [
    assignPopoverOpened,
    { toggle: toggleAssignPopover, close: closeAssignPopover },
  ] = useDisclosure(false);
  const ref = useClickOutside(closeAssignPopover, ["mouseup", "touchend"]);
  const {
    scrollIntoView: scrollIntoIncidentDetail,
    targetRef: incidentDetailRef,
  } = useScrollIntoView<HTMLDivElement>();
  const [selectedIncidentItem, setSelectedIncidentItem] =
    useState<IncidentDetail | null>(null);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedShift, setSelectedShift] =
    useState<SuperVisorAssignmentDetail | null>(null);

  const {
    data: incidentList,
    isLoading: isGetIncidentListLoading,
    refetch: refetchIncidentList,
  } = useGetIncidentByAssignmentId({
    id: selectedShift?.id ?? "",
    enabled: !!selectedShift,
  });
  const { mutate: assignSuperVisor, isLoading: isAssignSupervisorLoading } =
    useAssignSupervisor();
  const { data: employeeList, isLoading: isEmployeeListLoading } =
    useGetEmployeeList({ size: 999 });

  const {
    data: supervisorList,
    isLoading: isGetSupervisorListLoading,
    refetch: refetchSupervisorList,
  } = useGetSupervisorAssignmentHistory({
    date: dayjs(selectedDate ?? new Date()).format("YYYY-MM-DD"),
  });

  const { mutate: deleteSupervisor, isLoading: isDeleteSupervisorLoading } =
    useDeleteSupervisor();

  const { mutate: assignIncident, isLoading: isAssignIncidentLoading } =
    useAssignIncident();
  const { mutate: rejectIncident, isLoading: isRejectIncidentLoading } =
    useRejectIncidentById();

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

  const openConfirmSupervisorModal = ({
    id,
    supervisorName,
  }: {
    id: string;
    supervisorName: string;
  }) =>
    modals.openConfirmModal({
      title: "Please confirm modify supervisor",
      children: (
        <Text size="sm">
          Confirm modify{" "}
          <Text inherit span fw={600}>
            {supervisorName}
          </Text>{" "}
          as new supervisor
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        assignSuperVisor(
          { employeeId: id, role: Role.ShopSupervisor },
          {
            onSuccess() {
              notifications.show({
                title: "Success",
                message: "Assign supervisor successfully!",
                autoClose: 6000,
                c: NotificationColorPalette.UP_COMING,
              });
              refetchSupervisorList();
            },
            onError(data) {
              const error = data as AxiosError<ResponseErrorDetail>;
              notifications.show({
                title: "Failed",
                message: error?.message ?? "Assign supervisor failed!",
                autoClose: 6000,
                c: NotificationColorPalette.ALERT_MESSAGE,
              });
            },
          }
        );
      },
    });

  const openConfirmDeleteSupervisorModal = () => {
    modals.openConfirmModal({
      title: "Please confirm delete supervisor",
      children: <Text size="sm">Confirm delete supervisor?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        deleteSupervisor(
          {},
          {
            onSuccess() {
              notifications.show({
                message: "Remove supervisor successfully!",
                title: "Success",
              });
              refetchSupervisorList();
            },
            onError(data) {
              const error = data as AxiosError<ResponseErrorDetail>;
              notifications.show({
                title: "Failed",
                message: error?.message ?? "Remove supervisor failed!",
                autoClose: 6000,
                c: NotificationColorPalette.ALERT_MESSAGE,
              });
            },
          }
        );
      },
    });
  };

  // useEffect(() => {
  //   if (incidentList) {
  //     scrollIntoView();
  //   }
  // }, [incidentList]);

  useEffect(() => {
    if (selectedIncidentItem) {
      scrollIntoIncidentDetail();
    }
  }, [selectedIncidentItem]);

  const reverseSupervisorList = useMemo(() => {
    if (!isGetSupervisorListLoading && supervisorList) {
      return supervisorList?.reverse();
    }
  }, [supervisorList, isGetSupervisorListLoading]);

  useEffect(() => {
    if (reverseSupervisorList && reverseSupervisorList.length > 0) {
      const lastShiftItem = reverseSupervisorList?.[0];
      setSelectedShift({
        ...lastShiftItem,
        startTime: dayjs(lastShiftItem?.startTime).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        endTime: dayjs(lastShiftItem?.endTime).format("YYYY-MM-DDTHH:mm:ss"),
      });
    } else {
      setSelectedShift(null);
    }
  }, [reverseSupervisorList]);

  const employeeStatisticData = useMemo(() => {
    if (employeeList) {
      return _.groupBy(employeeList?.values, (i) => {
        return i.employeeRole;
      });
    }
  }, [employeeList]);

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
      <Table.Td py={rem(18)}>
        <Skeleton w={"100%"} h={rem(40)} />
      </Table.Td>
    </Table.Tr>
  ) : (
    incidentList?.map((item) => (
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
            <Text fw={500} size={rem(13)}>
              {item.incidentType}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text fw={500} size={rem(13)}>
              {item?.startTime
                ? dayjs(item.startTime).format("HH:mm | DD-MM")
                : "Empty"}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text fw={500} size={rem(13)}>
              {item?.endTime
                ? dayjs(item.endTime).format("HH:mm | DD-MM")
                : "Empty"}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text fw={500} size={rem(13)}>
              {item?.evidences.length}
            </Text>
          </Center>
        </Table.Td>
        <Table.Td py={rem(18)}>
          <Center>
            <Text c={"rgb(17 24 39"} fw={500} size={rem(13)}>
              {item?.assignment?.supervisor?.name ?? "Empty"}
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
            <Text fw={500} size={rem(13)}>
              {item.status}
            </Text>
          </Center>
        </Table.Td>
      </Table.Tr>
    ))
  );

  const handleSetSuperVisor = ({
    id,
    role,
    name,
  }: {
    id: string;
    role: Role.ShopSupervisor;
    name: string;
  }) => {
    if (role == Role.ShopSupervisor) {
      openConfirmSupervisorModal({
        id: id,
        supervisorName: name,
      });
    }
  };

  const openRejectIncidentModal = (incidentId: string) => {
    modals.openConfirmModal({
      title: "Reject Incident",
      confirmProps: { color: "red" },
      children: <Text size="sm">Reject this incident?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      centered: true,
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        rejectIncident(incidentId, {
          onSuccess() {
            notifications.show({
              title: "Successful",
              message: "Reject successfully!",
            });
            refetchIncidentList();
          },
          onError(data) {
            const error = data as AxiosError<ResponseErrorDetail>;
            notifications.show({
              color: "red",
              icon: <IconX />,
              title: "Reject failed",
              message: error.response?.data?.message,
            });
          },
        });
      },
    });
  };

  const onAssignIncident = ({
    employeeId,
    incidentId,
  }: {
    employeeId: string;
    incidentId: string;
  }) => {
    assignIncident(
      {
        employeeId,
        incidentId,
      },
      {
        onSuccess() {
          notifications.show({
            title: "Assign successfully",
            message: "Incident assign success!",
          });
          closeAssignPopover();
          refetchIncidentList();
        },
        onError(data) {
          const error = data as AxiosError<ResponseErrorDetail>;
          notifications.show({
            color: "red",
            icon: <IconX />,
            title: "Assign failed",
            message: error.response?.data?.message,
          });
        },
      }
    );
  };

  return (
    <>
      <Flex
        px={rem(60)}
        pt={rem(40)}
        bg={computedColorScheme == "light" ? "#fff" : ""}
        flex={1}
        pb={rem(40)}
        direction={"column"}
      >
        <Group align="flex-start" gap={rem(60)}>
          <Box flex={4}>
            <Group justify="space-between" align="center">
              <Text
                c={computedColorScheme == "light" ? "rgb(17, 24, 39)" : "white"}
                fw={600}
                size={rem(17)}
                lh={rem(36)}
              >
                Supervisor shift
              </Text>
              <ActionIcon
                variant="light"
                aria-label="Settings"
                onClick={toggle}
                color={
                  computedColorScheme == "light"
                    ? "rgb(79, 70, 229)"
                    : "#A194FF"
                }
                size={"lg"}
              >
                <IconSettings
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Group>
            <Collapse in={opened}>
              <Group
                style={{
                  paddingTop: rem(16),
                  marginTop: rem(12),
                  borderTop: "1px solid #ccc",
                }}
              >
                {isEmployeeListLoading ||
                isDeleteSupervisorLoading ||
                isGetSupervisorListLoading ||
                isAssignSupervisorLoading ? (
                  <Loader />
                ) : (
                  <Select
                    radius={rem(8)}
                    size={"sm"}
                    flex={1}
                    style={{
                      fontWeight: 500,
                      fontSize: rem(14),
                    }}
                    label="Current supervisor"
                    clearable
                    disabled={!!selectedDate && !isToday(selectedDate)}
                    allowDeselect
                    styles={{
                      label: {
                        marginBottom: rem(4),
                      },
                    }}
                    onChange={(_value, option) => {
                      if (option) {
                        handleSetSuperVisor({
                          id: _value ?? "",
                          role: Role.ShopSupervisor,
                          name: option?.label,
                        });
                      }
                    }}
                    placeholder="Supervisor is empty"
                    p={0}
                    value={reverseSupervisorList?.[0]?.supervisorId}
                    searchable
                    rightSectionPointerEvents={"inherit"}
                    onClear={() => {
                      openConfirmDeleteSupervisorModal();
                    }}
                    onClick={(e) => e.preventDefault()}
                    nothingFoundMessage="Nothing found..."
                    data={[
                      {
                        group: "Head supervisor",
                        items: employeeStatisticData?.HeadSupervisor
                          ? employeeStatisticData?.HeadSupervisor.map((i) => {
                              return {
                                value: i.id,
                                label: i.name,
                              };
                            })
                          : [],
                      },
                      {
                        group: "Supervisor",
                        items: employeeStatisticData?.Supervisor
                          ? employeeStatisticData?.Supervisor.map((i) => {
                              return {
                                value: i.id,
                                label: i.name,
                              };
                            })
                          : [],
                      },
                      {
                        group: "Employee",
                        items: employeeStatisticData?.Employee
                          ? employeeStatisticData?.Employee.map((i) => {
                              return {
                                value: i.id,
                                label: i.name,
                              };
                            })
                          : [],
                      },
                    ]}
                  />
                )}
              </Group>
            </Collapse>
            {isGetSupervisorListLoading ? (
              <>
                <Skeleton
                  radius={"md"}
                  mt={rem(20)}
                  w={"100%"}
                  height={rem(80)}
                />{" "}
                <Skeleton
                  radius={"md"}
                  mt={rem(20)}
                  w={"100%"}
                  height={rem(80)}
                />{" "}
                <Skeleton
                  radius={"md"}
                  mt={rem(20)}
                  w={"100%"}
                  height={rem(80)}
                />
              </>
            ) : (
              <Accordion
                variant="separated"
                radius="md"
                mt={rem(20)}
                defaultValue={DEFAULT_PAGE_SIZE}
              >
                {reverseSupervisorList?.map((i, index) => {
                  return (
                    <Accordion.Item
                      style={{
                        backgroundColor:
                          computedColorScheme == "light"
                            ? "#fefefe"
                            : "#1f1f1f",
                        border: "1px solid #ccc",
                      }}
                      key={index.toString()}
                      value={index.toString()}
                      className={
                        i.id == selectedShift?.id
                          ? classes["activeAccordion"]
                          : ""
                      }
                      onClick={() => {
                        setSelectedShift({
                          ...i,
                          startTime: dayjs(i?.startTime).format(
                            "YYYY-MM-DDTHH:mm:ss"
                          ),
                          endTime: dayjs(i?.endTime ?? new Date()).format(
                            "YYYY-MM-DDTHH:mm:ss"
                          ),
                        });
                      }}
                    >
                      <Accordion.Control>
                        <Group
                          key={i.id}
                          justify="space-between"
                          py={rem(8)}
                          px={rem(12)}
                        >
                          <Box>
                            <Text
                              c={
                                computedColorScheme == "light"
                                  ? "rgb(17, 24, 39)"
                                  : "white"
                              }
                              lh={rem(26)}
                              fw={500}
                              size={rem(16)}
                              mb={rem(4)}
                            >
                              {i?.inChargeAccount?.name}
                            </Text>
                            <Group gap={0}>
                              <IconCalendarTime
                                style={{
                                  width: rem(20),
                                  aspectRatio: 1,
                                }}
                              />

                              <Text
                                ml={rem(10)}
                                c={"grey"}
                                lh={rem(26)}
                                size={rem(14)}
                              >
                                {format(
                                  i.startTime ?? new Date(),
                                  "MMMM do, yyyy "
                                )}
                                from{" "}
                                {format(i?.startTime ?? new Date(), "hh:mm a")}{" "}
                                to{" "}
                                {i?.endTime
                                  ? format(i?.endTime ?? new Date(), "hh:mm a")
                                  : "Now"}
                              </Text>
                              {i.incidents.length != 0 && (
                                <>
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
                                    ml={rem(6)}
                                    c={"#c92a2a"}
                                    lh={rem(26)}
                                    size={rem(14)}
                                  >
                                    {i.incidents.length + " "}
                                    incident(s)
                                  </Text>
                                </>
                              )}
                              {i.interactions.length != 0 && (
                                <>
                                  <Divider
                                    mx={rem(16)}
                                    color="rgb(107,114,128,.5)"
                                    orientation="vertical"
                                  />
                                  <IconBrandHipchat
                                    style={{
                                      width: rem(20),
                                      aspectRatio: 1,
                                    }}
                                    color={
                                      computedColorScheme == "light"
                                        ? "#198754"
                                        : "#33A788"
                                    }
                                  />
                                  <Text
                                    ml={rem(6)}
                                    c={
                                      computedColorScheme == "light"
                                        ? "#198754"
                                        : "#33A788"
                                    }
                                    lh={rem(26)}
                                    size={rem(14)}
                                  >
                                    {i.interactions.length + " "}
                                    interaction(s)
                                  </Text>
                                </>
                              )}
                            </Group>
                          </Box>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <>
                          {isEmployeeListLoading ||
                          isGetSupervisorListLoading ? (
                            <Loader />
                          ) : (
                            <>
                              <Stack
                                gap={0}
                                px={rem(12)}
                                style={{
                                  borderRadius: rem(8),
                                  backgroundColor:
                                    computedColorScheme == "light"
                                      ? "#fefefe"
                                      : "#1f1f1f",
                                  // border: "1px solid #ccc",
                                }}
                              >
                                <Group
                                  justify="space-between"
                                  align="center"
                                  pb={rem(4)}
                                >
                                  <Text c={"grey"} size={rem(14)}>
                                    Supervisor
                                  </Text>
                                  <Text
                                    c={"rgb(17, 24, 39)"}
                                    size={rem(14)}
                                    fw={500}
                                  >
                                    {i?.supervisor?.name ?? (
                                      <Text span inherit c={"#ccc"}>
                                        Supervisor is empty
                                      </Text>
                                    )}
                                  </Text>
                                </Group>

                                <Group
                                  justify="space-between"
                                  align="center"
                                  py={rem(20)}
                                >
                                  <Text
                                    c={"rgb(17, 24, 39)"}
                                    size={rem(14)}
                                    fw={500}
                                  >
                                    In charge
                                  </Text>
                                  <Group
                                    justify="space-between"
                                    align="center"
                                    gap={rem(8)}
                                  >
                                    <Text
                                      c={
                                        computedColorScheme == "light"
                                          ? "rgb(79, 70, 229)"
                                          : "light-blue.4"
                                      }
                                      fw={500}
                                      size={rem(14)}
                                    >
                                      {selectedShift?.inChargeAccount.name}
                                    </Text>

                                    <Text
                                      py={rem(4)}
                                      px={rem(7)}
                                      bg={
                                        computedColorScheme == "light"
                                          ? "rgb(240 253 244)"
                                          : "#293c2c"
                                      }
                                      c={
                                        computedColorScheme == "light"
                                          ? "rgb(21 128 61)"
                                          : "#89e597"
                                      }
                                      size={rem(12)}
                                      fw={500}
                                      style={{
                                        borderRadius: 999,
                                        border: "1px solid #ccc",
                                      }}
                                    >
                                      {renderInChargeRole(
                                        selectedShift?.inChargeAccountRole
                                      )}
                                    </Text>
                                  </Group>
                                </Group>
                              </Stack>
                            </>
                          )}
                        </>
                      </Accordion.Panel>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            )}
          </Box>

          <Box flex={3}>
            <Box pb={rem(4)}>
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
                    color={computedColorScheme == "dark" ? "white" : "#000"}
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
              <SimpleGrid cols={7} spacing={0}>
                {WEEKDAYS.map((day, i) => {
                  return (
                    <Box py={rem(8)} key={day + i}>
                      <Text
                        key={day}
                        c={
                          computedColorScheme == "light"
                            ? "rgb(55 65 81)"
                            : "white"
                        }
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
                        backgroundColor:
                          computedColorScheme == "dark" ? "#1f1f1f" : "white",
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
                          ? clsx(classes.today)
                          : dayjs(day).isSame(selectedDate, "day")
                          ? clsx(classes.selectedDay)
                          : classes["activeCard"]
                      }
                      onClick={() => {
                        setSelectedDate(day);
                      }}
                    >
                      <Text
                        c={
                          computedColorScheme == "light"
                            ? "rgb(55, 65, 81)"
                            : "white"
                        }
                        size={rem(12)}
                        lh={rem(48)}
                      >
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
                        backgroundColor:
                          computedColorScheme == "dark" ? "#1f1f1f" : "white",
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
          {incidentList || isGetIncidentListLoading ? (
            <Card
              radius={8}
              w={"100%"}
              mb={rem(40)}
              style={{
                border: "1px solid #ccc",
              }}
            >
              <Card.Section
                style={{
                  borderBottom: "1px solid #ccc",
                }}
                bg={computedColorScheme == "light" ? "#f9fafb" : "#1f1f1f"}
                py={rem(20)}
                px={rem(12)}
              >
                <Group justify="space-between">
                  <Text size="md" fw={600} ml={rem(12)}>
                    Incidents & Interactions
                  </Text>
                  <Group gap={rem(6)}>
                    <Text fw={500} size="sm">
                      From
                    </Text>
                    <Badge
                      radius={"sm"}
                      color={"green"}
                      style={{
                        border: "1px solid #000",
                        color: "#000",
                      }}
                      variant="light"
                      mr={rem(10)}
                    >
                      {dayjs(selectedShift?.startTime).format("HH:mm | DD-MM")}
                    </Badge>
                    <Text fw={500} size="sm">
                      to
                    </Text>
                    <Badge
                      radius={"sm"}
                      color={"green"}
                      style={{
                        border: "1px solid #000",
                        color: "#000",
                      }}
                      variant="light"
                      mr={rem(16)}
                    >
                      {dayjs(selectedShift?.endTime ?? new Date()).format(
                        "HH:mm DD-MM"
                      )}
                    </Badge>
                  </Group>
                </Group>
              </Card.Section>

              <Card.Section>
                <ScrollArea.Autosize
                  mah={700}
                  onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
                >
                  {incidentList?.length == 0 ? (
                    <Box my={rem(10)}>
                      <NoImage type="NO_DATA" />
                    </Box>
                  ) : (
                    <Table striped highlightOnHover withColumnBorders>
                      <>
                        <Table.Thead
                          className={cx(classes.header, {
                            [classes.scrolled]: scrolled,
                          })}
                        >
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
                                <Text
                                  size={rem(13)}
                                  lh={rem(24)}
                                  c={"rgb(55 65 81)"}
                                  fw={600}
                                >
                                  In charge
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
                                <Text size={rem(13)} lh={rem(24)} fw={600}>
                                  Status
                                </Text>
                              </Center>
                            </Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                      </>
                    </Table>
                  )}
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
                  bg={computedColorScheme == "light" ? "#f9fafb" : "#1f1f1f"}
                  py={rem(16)}
                  px={rem(24)}
                >
                  <Group justify="space-between">
                    <Text size="md" fw={600}>
                      {selectedIncidentItem?.incidentType ==
                      IncidentType.Interaction
                        ? "Interaction detail"
                        : "Incident detail"}
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
                <ScrollArea.Autosize
                  mah={1000}
                  py={rem(12)}
                  bg={computedColorScheme == "light" ? "#fff" : "#1f1f1f"}
                >
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
                            selectedIncidentItem?.evidences?.[0]?.createdDate
                          ).format("LL")}
                        </Text>
                        {selectedIncidentItem?.incidentType !=
                          IncidentType.Interaction && (
                          <Group>
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
                                {selectedIncidentItem?.employee?.name ??
                                  "(Empty)"}
                              </Text>
                            </Text>

                            <Popover
                              position="bottom"
                              withArrow
                              shadow="md"
                              opened={assignPopoverOpened}
                            >
                              <Popover.Target>
                                <Button
                                  loading={isAssignIncidentLoading}
                                  variant="outline"
                                  color="rgb(79, 70, 229)"
                                  onClick={toggleAssignPopover}
                                >
                                  Assign
                                </Button>
                              </Popover.Target>
                              <Popover.Dropdown>
                                {isEmployeeListLoading ? (
                                  <Loader />
                                ) : (
                                  <Select
                                    ref={ref}
                                    size="sm"
                                    style={{
                                      fontWeight: 500,
                                      borderRadius: rem(8),
                                    }}
                                    onChange={(_value) => {
                                      console.log(123);

                                      onAssignIncident({
                                        employeeId: _value ?? "",
                                        incidentId: selectedIncidentItem.id,
                                      });
                                    }}
                                    placeholder="Assign to.."
                                    searchable
                                    value={selectedIncidentItem?.id}
                                    data={employeeList?.values?.map((item) => {
                                      return {
                                        value: item?.id,
                                        label: item?.name,
                                      };
                                    })}
                                    nothingFoundMessage="Nothing found..."
                                  />
                                )}
                              </Popover.Dropdown>
                            </Popover>

                            <Button
                              color={"red"}
                              loading={isRejectIncidentLoading}
                              onClick={() => {
                                openRejectIncidentModal(
                                  selectedIncidentItem.id
                                );
                              }}
                            >
                              Reject
                            </Button>
                          </Group>
                        )}
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
