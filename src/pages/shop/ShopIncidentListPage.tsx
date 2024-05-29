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
  LoadingOverlay,
  Pagination,
  Paper,
  Popover,
  ScrollArea,
  Select,
  Text,
  Tooltip,
  rem
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure, useListState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconFilter,
  IconIdOff,
  IconSquareRounded,
  IconSquareRoundedCheck,
  IconSquareRoundedMinus,
  IconUserUp,
  IconX
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
  const [selectedPopoverOpened, { toggle: toggleSelectedPopover, close: closeSelectedPopover }] = useDisclosure(false);
  const [activePage, setPage] = useState(1);
  const [selectedIncident, setSelectedIncident] = useState<{
    id: string;
  } | null>(null);

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
          closeSelectedPopover();
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
      incidentType: IncidentType.Incident,
      size: 20,
      pageIndex: activePage - 1,
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
      size: 20,
      pageIndex: activePage - 1,
    };
    sb = _.omitBy(sb, _.isNil) as GetIncidentParams;
    return sb;
  }, [
    activePage,
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
  const { data: employeeList, isLoading: isGetEmployeeListLoading } = useGetEmployeeList({});
  const { data: incidentData, isLoading: isGetIncidentLoading, refetch: refetchIncident, } = useGetIncidentById(selectedIncident?.id ?? null);
  const { mutate: rejectIncident, isLoading: isRejectIncidentLoading } = useRejectIncidentById();
  const { mutate: massRejectIncident, isLoading: isMassRejectIncidentLoading } = useMassRejectIncidents();
  const { mutate: massAssignIncident, isLoading: isMassAssignIncidentLoading } = useMassAssignIncidents();
  const { mutate: assignIncident, isLoading: isAssignIncidentLoading } = useAssignIncident();

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
    handlers.setState(incidentList?.values || []);
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
        // console.log(params);

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
      w={rem(350)} pl={rem(18)}
      key={row?.id}
      className={
        row?.id == selectedIncident?.id
          ? classes["incident_card_active"]
          : classes["incident_card"]
      }
    >
      <Group justify="space-between">
        <Checkbox
          w={20} size="xs"
          checked={row.checked}
          disabled={row.disabled}
          onChange={(event) =>
            handlers.setItemProp(index, "checked", event.currentTarget.checked)
          }
        />
        <Group
          justify="space-between"
          w={260} py={rem(14)} pr={rem(18)}
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
        px={rem(20)} pt={24} pb={10}
      >
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Incident list
        </Text>
      </Group>

      <Group
        px={rem(13)}
        pb={!openedFilter ? rem(24) : rem(0)}
        justify="space-between"
      >

        {/* Top section */}
        <Group>
          <Group>
            <Tooltip label="Select All">
              <ActionIcon
                variant="subtle"
                color={"gray"}
                onClick={() => {
                  handlers.setState((current) =>
                    current.map((value) => ({ ...value, checked: !allChecked }))
                  )
                }}
              >
                {allChecked ? <IconSquareRoundedCheck size={20} /> : indeterminate ? <IconSquareRoundedMinus size={20} /> : <IconSquareRounded size={20} />}
              </ActionIcon>
            </Tooltip>

            {selectedCount > 0 &&
              <Text>|</Text>
            }

            {selectedCount > 0 &&
              <Popover trapFocus position="bottom" withArrow shadow="md" opened={selectedPopoverOpened}>
                <Popover.Target>
                  <Tooltip label="Assign selected" withArrow>
                    <ActionIcon
                      variant="subtle" color={"gray"}
                      onClick={toggleSelectedPopover}
                    >
                      <IconUserUp size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Popover.Target>
                <Popover.Dropdown>
                  <form onSubmit={massAssignIncidentForm.onSubmit(onMassAssignIncident)}>
                    <Group align="baseline">
                      {isGetEmployeeListLoading ? (
                        <Loader mt={rem(30)} />
                      ) : (
                        <Select
                          size="xs"
                          {...massAssignIncidentForm.getInputProps("employeeId")}
                          placeholder="Assign to.."
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
                        Assign
                      </Button>
                    </Group>
                  </form>
                </Popover.Dropdown>
              </Popover>
            }

            {selectedCount > 0 &&
              <Tooltip label="Reject selected" withArrow>
                <ActionIcon
                  variant="subtle" color={"gray"}
                  onClick={openMassRejectModal}
                  loading={isMassRejectIncidentLoading}
                >
                  <IconIdOff size={20} />
                </ActionIcon>
              </Tooltip>
            }

            {selectedCount > 0 &&
              <Text>|</Text>
            }

            <Tooltip label="Filter" withArrow>
              <ActionIcon color={"gray"}
                variant={openedFilter ? "filled" : "subtle"}
                onClick={toggleFilter}
              >
                <IconFilter size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <Group gap={50}>
          {selectedCount > 0 &&
            <Text size="sm" fs="italic">
              {selectedCount} incident&#40;s&#41; selected
            </Text>
          }
          <Pagination
            value={activePage}
            onChange={setPage}
            total={Math.ceil((incidentList?.totalCount ?? 0) / 20)}
          />
        </Group>
      </Group>

      {/* Filter collapse section */}
      <Collapse px={rem(28)} in={openedFilter} mb={"lg"} mt={"md"}>
        <Divider />
        <Group mt={10} justify="right">
          {form.isDirty() ? (
            <Button variant="transparent" onClick={form.reset}>
              Clear all filter
            </Button>
          ) : (
            <></>
          )}
        </Group>
        <EditAndUpdateForm fields={filterFields} />
      </Collapse>

      {/* Main section */}
      <Flex flex={1} className={classes["body_container"]}>
        {/* Left side scroll section */}
        <ScrollArea
          type="hover"
          mah="calc(84vh - var(--app-shell-header-height) - var(--app-shell-footer-height, 0px) )"
          pos="relative"
        >
          <LoadingOverlay visible={isGetIncidentListLoading} overlayProps={{ radius: "sm", blur: 8 }} />
          {renderIncidentList?.length == 0 ?
            <Center w={rem(350)} h={"calc(84vh - var(--app-shell-header-height) - var(--app-shell-footer-height, 0px) )"}>
              <Text fw={500} size="sm" c="dimmed" fs="italic">
                No Incident Found
              </Text>
            </Center>
            :
            renderIncidentList
          }
        </ScrollArea>
        <Divider mr={rem(4)} orientation="vertical" />
        <Divider mr={rem(8)} orientation="vertical" />

        {/* Right side view incident section */}
        {selectedIncident ? (
          <ScrollArea
            style={{ display: "flex", flex: 1 }}
            type="hover"
            mah="calc(84vh - var(--app-shell-header-height) - var(--app-shell-footer-height, 0px) )"
            pos="relative"
          >
            <LoadingOverlay visible={isGetIncidentLoading} overlayProps={{ radius: "sm", blur: 8 }} />
            <Box pl={rem(12)} pr={rem(32)}>
              <Group justify="space-between" align="center">

                <Box py={rem(16)} >
                  <Group align="center">
                    <Text fw={500} size={rem(20)}>
                      Total evidence:{" "}
                      <Text span c={"blue"} inherit>
                        {incidentData?.evidences.length}
                      </Text>
                    </Text>
                    <Text>|</Text>
                    <Text fw={500} size={rem(20)}>
                      AI identity :{" "}
                      <Text span c={"blue"} inherit>
                        {incidentData?.aiId}
                      </Text>
                    </Text>
                  </Group>
                </Box>

                {/* Single assign form */}
                <Group>
                  <form onSubmit={assignIncidentForm.onSubmit(onAssignIncident)}>
                    <Group align="baseline">
                      {isGetEmployeeListLoading ? (
                        <Loader mt={rem(30)} />
                      ) : (
                        <Select
                          size="xs"
                          {...assignIncidentForm.getInputProps("employeeId")}
                          placeholder="Assign to.."
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
                        loading={isAssignIncidentLoading}
                        gradient={{
                          from: "light-blue.5",
                          to: "light-blue.7",
                          deg: 90,
                        }}
                      >
                        Assign
                      </Button>
                    </Group>
                  </form>
                  <Text>|</Text>
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
                    In Charge:{" "}
                    <Text span c={"blue"} inherit>
                      {incidentData?.assignment?.inChargeAccount?.name ?? "None"}
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
            </Box>
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
