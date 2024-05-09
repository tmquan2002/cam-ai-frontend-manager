import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Collapse,
  Divider,
  Flex,
  Group,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Select,
  Skeleton,
  Text,
  Tooltip,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure, useListState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconFilter,
  IconIdOff,
  IconSelect,
  IconUserUp,
  IconX,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import {
  GetIncidentParams,
  MassRejectIncidentParams,
} from "../../apis/IncidentAPI";
import StatusBadge from "../../components/badge/StatusBadge";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import LoadingImage from "../../components/image/LoadingImage";
import NoImage from "../../components/image/NoImage";
import { useAssignIncident } from "../../hooks/useAssignIncident";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { useGetIncidentById } from "../../hooks/useGetIncidentById";
import {
  IncidentDetailWithChecked,
  useGetOrderedIncidentListChecked,
} from "../../hooks/useGetIncidentList";
import { useMassAssignIncidents } from "../../hooks/useMassAssignIncidents";
import { useMassRejectIncidents } from "../../hooks/useMassRejectIncidents";
import { useRejectIncidentById } from "../../hooks/useRejectIncidentById";
import {
  EvidenceType,
  IncidentStatus,
  IncidentType,
} from "../../models/CamAIEnum";
import { EvidenceDetail } from "../../models/Evidence";
import { ResponseErrorDetail } from "../../models/Response";
import { mapLookupToArray } from "../../utils/helperFunction";
import classes from "./ShopIncidentListPage.module.scss";

//TODO: Improve list that has pagination
type SearchIncidentField = {
  incidentType?: IncidentType | null;
  fromTime?: Date | null;
  toTime?: Date | null;
  edgeBoxId?: string;
  status?: IncidentStatus | null;
  shopId?: string;
  brandId?: string;
  employeeId?: string | null;
  size?: number;
  pageIndex?: number;
};

type IncidentFormField = {
  employeeId: string | null;
};

const ShopIncidentListPage = () => {
  const [openedFilter, { toggle: toggleFilter }] = useDisclosure(false);
  const [assignOpened, { open: openAssign, close: closeAssign }] =
    useDisclosure(false);
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const [selectedIncident, setSelectedIncident] = useState<{
    id: string;
  } | null>(null);

  // For selection
  const [openedSelect, { toggle: toggleSelect }] = useDisclosure(false);
  // const [openedMerge, { toggle: toggleMerge }] = useDisclosure(false);
  const [checkBoxMode, setCheckBoxMode] = useState("None");

  //Check box list section
  const [incidentCheckBoxList, handlers] =
    useListState<IncidentDetailWithChecked>([]);
  const allChecked = incidentCheckBoxList.every((value) => value.checked);
  const indeterminate =
    incidentCheckBoxList.some((value) => value.checked) && !allChecked;
  // const [firstCheckId, setFirstCheckId] = useState("");
  const selectedCount = incidentCheckBoxList.filter(
    (item) => item.checked
  ).length;

  const assignIncidentForm = useForm<IncidentFormField>({
    validate: {
      employeeId: isNotEmpty("Please select an employee to assign"),
    },
  });

  const massAssignIncidentForm = useForm<IncidentFormField>({
    validate: {
      employeeId: isNotEmpty("Please select an employee to assign"),
    },
  });

  const onAssignIncident = (fieldValues: IncidentFormField) => {
    assignIncident(
      {
        employeeId: fieldValues.employeeId ?? "",
        incidentId: selectedIncident?.id ?? "",
      },
      {
        onSuccess() {
          notifications.show({
            title: "Assign successfully",
            message: "Incident assign success!",
          });
          refetchIncident();
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

  const onMassAssignIncident = (fieldValues: IncidentFormField) => {
    if (selectedCount == 0) {
      notifications.show({
        color: "yellow",
        title: "Note",
        message: "No incident selected",
      });
      return;
    }

    massAssignIncident(
      {
        employeeId: fieldValues.employeeId ?? "",
        incidentIds: incidentCheckBoxList
          ? incidentCheckBoxList?.reduce(function (
              filtered: string[],
              incident
            ) {
              if (incident.checked) {
                filtered.push(incident.id);
              }
              return filtered;
            },
            [])
          : [],
      },
      {
        onSuccess() {
          notifications.show({
            title: "Assign successfully",
            message: "Incidents assign success!",
          });
          refetchIncident();
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

  const form = useForm<SearchIncidentField>({
    initialValues: {
      employeeId: null,
      fromTime: null,
      status: null,
      toTime: null,
      incidentType: null,
      size: 999,
    },
  });

  const searchParams: GetIncidentParams = useMemo(() => {
    let sb: GetIncidentParams = {
      employeeId: form.values.employeeId,
      fromTime: form.values.fromTime
        ? dayjs(form.values.fromTime).format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      toTime: form.values.toTime
        ? dayjs(form.values.toTime).format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      status: form.values.status,
      incidentType: form.values.incidentType,
      size: form?.values.size,
    };
    sb = _.omitBy(sb, _.isNil) as GetIncidentParams;
    return sb;
  }, [
    form.values.employeeId,
    form.values.fromTime,
    form.values.incidentType,
    form.values.status,
    form.values.toTime,
  ]);

  // API query section
  const {
    data: incidentList,
    isLoading: isGetIncidentListLoading,
    refetch: refetchIncidentList,
  } = useGetOrderedIncidentListChecked(searchParams);
  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({});
  const {
    data: incidentData,
    isLoading: isGetIncidentLoading,
    refetch: refetchIncident,
  } = useGetIncidentById(selectedIncident?.id ?? null);
  const { mutate: rejectIncident, isLoading: isRejectIncidentLoading } =
    useRejectIncidentById();
  const { mutate: massRejectIncident, isLoading: isMassRejectIncidentLoading } =
    useMassRejectIncidents();
  const { mutate: massAssignIncident, isLoading: isMassAssignIncidentLoading } =
    useMassAssignIncidents();
  const { mutate: assignIncident, isLoading: isAssignIncidentLoading } =
    useAssignIncident();

  useEffect(() => {
    if (form.isDirty()) {
      setSelectedIncident(null);
    }
  }, [form.isDirty(), form.values]);

  useEffect(() => {
    if (incidentData?.employeeId) {
      assignIncidentForm.setInitialValues({
        employeeId: incidentData?.employeeId,
      });
    } else {
      assignIncidentForm.setInitialValues({ employeeId: null });
    }
    assignIncidentForm.reset();
  }, [incidentData]);

  useEffect(() => {
    handlers.setState(incidentList || []);
  }, [incidentList]);

  const openRejectModal = () => {
    modals.openConfirmModal({
      title: "Reject Incident",
      confirmProps: { color: "red" },
      children: <Text size="sm">Reject this incident?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      centered: true,
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        rejectIncident(selectedIncident?.id ?? "", {
          onSuccess() {
            notifications.show({
              title: "Successful",
              message: "Reject successfully!",
            });
            refetchIncident();
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

  const openMassRejectModal = () => {
    modals.openConfirmModal({
      title: "Reject Incidents",
      confirmProps: { color: "red" },
      children: (
        <Text size="sm">
          Reject {selectedCount} selected incident&#40;s&#41;?
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      centered: true,
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        const params: MassRejectIncidentParams = {
          incidentIds: incidentCheckBoxList
            ? incidentCheckBoxList?.reduce(function (
                filtered: string[],
                incident
              ) {
                if (incident.checked) {
                  filtered.push(incident.id);
                }
                return filtered;
              },
              [])
            : [],
        };
        console.log(params);

        massRejectIncident(params, {
          onSuccess() {
            notifications.show({
              title: "Successful",
              message: "Reject successfully!",
            });
            refetchIncident();
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

  const filterFields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Employee",
          placeholder: "Employee",
          data: employeeList?.values?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          name: "employeeId",
          loading: isGetEmployeeListLoading,
        },
        spans: 4,
      },

      {
        type: FIELD_TYPES.DATE_TIME,
        fieldProps: {
          form,
          name: "fromTime",
          placeholder: "Start date",
          label: "Start date",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.DATE_TIME,
        fieldProps: {
          form,
          name: "toTime",
          placeholder: "End date",
          label: "End date",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.RADIO,
        fieldProps: {
          form,
          name: "status",
          placeholder: "Incident status",
          label: "Incident status",
          data: mapLookupToArray(IncidentStatus ?? {}),
        },
        spans: 3,
      },
      {
        type: FIELD_TYPES.RADIO,
        fieldProps: {
          form,
          name: "incidentType",
          placeholder: "Incident type",
          label: "Incident type",
          data: [
            {
              key: IncidentType.Phone,
              value: "Phone",
            },
            {
              key: IncidentType.Uniform,
              value: "Uniform",
            },
          ],
        },
        spans: 3,
      },
    ];
  }, [employeeList?.values, form, isGetEmployeeListLoading]);

  const renderIncidentList = incidentCheckBoxList?.map((row, index) => (
    <Box
      w={rem(350)}
      py={rem(14)}
      px={rem(18)}
      key={row?.id}
      className={
        row?.id == selectedIncident?.id
          ? classes["incident_card_active"]
          : classes["incident_card"]
      }
    >
      <Group justify="space-between">
        {openedSelect && checkBoxMode !== "None" && (
          <Checkbox
            w={20}
            checked={row.checked}
            disabled={row.disabled}
            onChange={(event) =>
              handlers.setItemProp(
                index,
                "checked",
                event.currentTarget.checked
              )
            }
          />
        )}
        <Group
          justify="space-between"
          w={openedSelect && checkBoxMode !== "None" ? 260 : "100%"}
          onClick={() => {
            setSelectedIncident({ id: row?.id });
          }}
        >
          <Box>
            {/* Time */}
            <Text size="md">
              {dayjs(row?.startTime).format("DD/MM/YYYY h:mm A")}
            </Text>
            {/* Incident Name */}
            <Text c={"dimmed"} size="sm">
              {row?.incidentType} incident
            </Text>
          </Box>
          {/* Badge */}
          <StatusBadge
            statusName={row?.status || "None"}
            size="sm"
            padding={10}
          />
        </Group>
      </Group>
      {/* <Text>{dayjs(row?.endTime).format("DD/MM/YYYY h:mm A")}</Text> */}
    </Box>
  ));

  const renderIncidentFootage = (evidence: EvidenceDetail) => {
    switch (evidence.evidenceType) {
      case EvidenceType.Image:
        return (
          <Box>
            <Group align="center" mb={rem(12)}>
              <Group gap={"xl"}>
                <Box>
                  <Text fw={500} c={"dimmed"}>
                    Created time
                  </Text>
                  <Text fw={500}>
                    {dayjs(evidence?.createdDate).format("DD/MM/YYYY h:mm A")}
                  </Text>
                </Box>
              </Group>
            </Group>

            <LoadingImage
              radius={"md"}
              bg={"#000"}
              fit="contain"
              imageId={evidence?.imageId}
              // src={evidence?.image?.hostingUri}
            />
          </Box>
        );
    }
  };

  return (
    <Paper
      m={rem(16)}
      shadow="xs"
      style={{ display: "flex", flex: 1, flexDirection: "column" }}
    >
      <Group
        p={rem(24)}
        pb={!openedFilter ? rem(24) : rem(0)}
        align="center"
        justify="space-between"
      >
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Incident list
        </Text>

        {/* Top section */}
        <Group>
          {form.isDirty() ? (
            <Button variant="transparent" ml={"auto"} onClick={form.reset}>
              Clear all filter
            </Button>
          ) : (
            <></>
          )}

          <Tooltip label="Select Multiple" withArrow>
            <ActionIcon
              variant={checkBoxMode == "Select" ? "filled" : "subtle"}
              onClick={() => {
                handlers.setState(incidentList || []);

                if (openedSelect) {
                  setCheckBoxMode("None");
                  toggleSelect();
                } else {
                  setCheckBoxMode("Select");
                  toggleSelect();
                }

                if (openedFilter) toggleFilter();
                // if (openedMerge) toggleMerge()
              }}
              color={computedColorScheme == "dark" ? "white" : "black"}
            >
              <IconSelect size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Filter" withArrow>
            <ActionIcon
              variant={checkBoxMode == "Filter" ? "filled" : "subtle"}
              onClick={() => {
                handlers.setState(incidentList || []);

                if (openedFilter) {
                  setCheckBoxMode("None");
                  toggleFilter();
                } else {
                  setCheckBoxMode("Filter");
                  toggleFilter();
                }

                if (openedSelect) toggleSelect();
                // if (openedMerge) toggleMerge()
              }}
              color={computedColorScheme == "dark" ? "white" : "black"}
            >
              <IconFilter size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Filter collapse section */}
      <Collapse px={rem(28)} in={openedFilter} mb={"xl"} mt={"xs"}>
        <EditAndUpdateForm fields={filterFields} />
      </Collapse>

      {/* Select collapse section */}
      <Collapse px={rem(28)} in={openedSelect} mb={"xl"}>
        <Group justify="space-between" align="baseline">
          <Group gap={100}>
            <Checkbox
              label="Check All"
              checked={allChecked}
              indeterminate={indeterminate}
              onChange={() =>
                handlers.setState((current) =>
                  current.map((value) => ({ ...value, checked: !allChecked }))
                )
              }
            />
            <Text size="sm" fs="italic">
              {selectedCount} incident&#40;s&#41; selected
            </Text>
          </Group>

          <Group justify="flex-end" align="baseline">
            <form
              onSubmit={massAssignIncidentForm.onSubmit(onMassAssignIncident)}
            >
              <Group gap={5} align="baseline">
                {isGetEmployeeListLoading ? (
                  <Loader mt={rem(30)} />
                ) : (
                  <Select
                    w={rem(200)}
                    size="xs"
                    {...massAssignIncidentForm.getInputProps("employeeId")}
                    placeholder="Assign incident to an employee"
                    data={employeeList?.values?.map((item) => {
                      return {
                        value: item?.id,
                        label: item?.name,
                      };
                    })}
                    nothingFoundMessage="Nothing found..."
                  />
                )}
                <Button
                  variant="gradient"
                  size="xs"
                  type="submit"
                  loading={isMassAssignIncidentLoading}
                  gradient={{
                    from: "light-blue.5",
                    to: "light-blue.7",
                    deg: 90,
                  }}
                >
                  Assign Selected
                </Button>
              </Group>
            </form>

            <Button
              variant="gradient"
              size="xs"
              onClick={() => {
                if (selectedCount == 0) {
                  notifications.show({
                    color: "yellow",
                    title: "Note",
                    message: "No incident selected",
                  });
                } else {
                  openMassRejectModal();
                }
              }}
              loading={isMassRejectIncidentLoading}
              gradient={{ from: "pale-red.5", to: "pale-red.7", deg: 90 }}
            >
              Reject Selected
            </Button>
          </Group>
        </Group>
      </Collapse>

      {/* Main section */}
      <Flex flex={1} className={classes["body_container"]}>
        {/* Left side scroll section */}
        <ScrollArea
          type="hover"
          mah="calc(84vh - var(--app-shell-header-height) - var(--app-shell-footer-height, 0px) )"
        >
          <Skeleton visible={isGetIncidentListLoading}>
            {renderIncidentList}
          </Skeleton>
        </ScrollArea>
        <Divider mr={rem(4)} orientation="vertical" />
        <Divider mr={rem(8)} orientation="vertical" />

        {/* Right side view incident section */}
        {selectedIncident ? (
          <ScrollArea
            style={{ display: "flex", flex: 1 }}
            type="hover"
            mah="calc(84vh - var(--app-shell-header-height) - var(--app-shell-footer-height, 0px) )"
          >
            <Skeleton visible={isGetIncidentLoading}>
              <Box pl={rem(12)} pr={rem(32)}>
                <Group justify="space-between" align="center">
                  <Group py={rem(32)} align="center">
                    <Text size={rem(20)} fw={500}>
                      {incidentData?.incidentType} Incident
                    </Text>
                    <Text>|</Text>
                    <Text size={rem(20)} fw={500} c={"dimmed"}>
                      {" "}
                      {dayjs(incidentData?.startTime).format(
                        "DD/MM/YYYY h:mm A"
                      )}
                    </Text>
                    <StatusBadge
                      statusName={incidentData?.status || "None"}
                      size="sm"
                      padding={10}
                    />
                  </Group>

                  <Group>
                    <Tooltip label="Assign incident">
                      <ActionIcon
                        variant="gradient"
                        gradient={{
                          from: "light-blue.5",
                          to: "light-blue.7",
                          deg: 90,
                        }}
                        onClick={openAssign}
                      >
                        <IconUserUp
                          style={{ width: "70%", height: "70%" }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Reject incident">
                      <ActionIcon
                        variant="gradient"
                        gradient={{
                          from: "pale-red.5",
                          to: "pale-red.7",
                          deg: 90,
                        }}
                        onClick={openRejectModal}
                        loading={isRejectIncidentLoading}
                      >
                        <IconIdOff
                          style={{ width: "70%", height: "70%" }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                <Group justify="space-between" mb={rem(12)}>
                  <Text fw={500} size={rem(20)}>
                    Evidence
                  </Text>
                  <Group>
                    <Text fw={500} size={rem(16)}>
                      Total evidence:{" "}
                      <Text span c={"blue"} inherit>
                        {incidentData?.evidences.length}
                      </Text>
                    </Text>
                    <>|</>
                    <Text fw={500} size={rem(16)}>
                      AI identity :{" "}
                      <Text span c={"blue"} inherit>
                        {incidentData?.aiId}
                      </Text>
                    </Text>
                  </Group>
                </Group>
                <Divider color="#acacac" mb={rem(20)} />
                {_.isEmpty(incidentData?.evidences) ? (
                  <NoImage type="NO_DATA" />
                ) : (
                  incidentData?.evidences?.map((item) => {
                    return (
                      <Box key={item.id} mb={rem(20)}>
                        {renderIncidentFootage(item)}
                      </Box>
                    );
                  })
                )}

                {/* Assign single form section */}
                <Modal
                  opened={assignOpened}
                  onClose={closeAssign}
                  title="Assign to"
                  centered
                >
                  <Box>
                    <form
                      onSubmit={assignIncidentForm.onSubmit(onAssignIncident)}
                    >
                      <Group align="center" mt={rem(20)} pb={rem(20)}>
                        {isGetEmployeeListLoading ? (
                          <Loader mt={rem(30)} />
                        ) : (
                          <Select
                            w={rem(600)}
                            {...assignIncidentForm.getInputProps("employeeId")}
                            placeholder="Assign incident to an employee"
                            data={employeeList?.values?.map((item) => {
                              return {
                                value: item?.id,
                                label: item?.name,
                              };
                            })}
                            nothingFoundMessage="Nothing found..."
                          />
                        )}
                        <Button
                          type="submit"
                          loading={isAssignIncidentLoading}
                          disabled={!assignIncidentForm.isDirty()}
                        >
                          Confirm
                        </Button>
                      </Group>
                    </form>
                  </Box>
                </Modal>
              </Box>
            </Skeleton>
          </ScrollArea>
        ) : (
          <Center
            style={{
              display: "flex",
              flex: 1,
            }}
          >
            <Text fw={500} size="lg">
              Select an incident to view
            </Text>
          </Center>
        )}
      </Flex>
    </Paper>
  );
};

export default ShopIncidentListPage;
