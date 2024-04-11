import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Divider,
  Flex,
  Group,
  Image,
  Loader,
  Paper,
  ScrollArea,
  Select,
  Skeleton,
  Text,
  Tooltip,
  rem,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import classes from "./ShopIncidentListPage.module.scss";
import {
  EvidenceType,
  IncidentStatus,
  IncidentType,
} from "../../models/CamAIEnum";
import { IconFilter, IconIdOff, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { mapLookupToArray } from "../../utils/helperFunction";
import { useForm } from "@mantine/form";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { GetIncidentParams } from "../../apis/IncidentAPI";
import dayjs from "dayjs";
import _ from "lodash";
import { useGetIncidentById } from "../../hooks/useGetIncidentById";
import { useRejectIncidentById } from "../../hooks/useRejectIncidentById";
import { useAssignIncident } from "../../hooks/useAssignIncident";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import { EvidenceDetail } from "../../models/Evidence";
import NoImage from "../../components/image/NoImage";

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
  const [opened, { toggle }] = useDisclosure(false);
  const [selectedIncident, setSelectedIncident] = useState<{
    id: string;
  } | null>(null);

  const assignIncidentForm = useForm<IncidentFormField>();

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

  const {
    data: incidentList,
    isLoading: isGetIncidentListLoading,
    refetch: refetchIncidentList,
  } = useGetIncidentList(searchParams);

  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({});

  const {
    data: incidentData,
    isLoading: isGetIncidentLoading,
    refetch: refetchIncident,
  } = useGetIncidentById(selectedIncident?.id ?? null);

  const { mutate: rejectIncident, isLoading: isRejectIncidentLoading } =
    useRejectIncidentById();
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

  const openModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      confirmProps: { color: "red" },
      children: <Text size="sm">Confirm reject this incident?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        rejectIncident(selectedIncident?.id ?? "", {
          onSuccess() {
            notifications.show({
              title: "Reject successfully",
              message: "Reject assign success!",
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

  const fields = useMemo(() => {
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
          data: mapLookupToArray(IncidentType ?? {}),
        },
        spans: 2,
      },
    ];
  }, [employeeList?.values, form, isGetEmployeeListLoading]);

  const renderIncidentStatusBadge = (status: IncidentStatus | undefined) => {
    switch (status) {
      case IncidentStatus.New:
        return (
          <Badge color="yellow" radius={"sm"}>
            {IncidentStatus.New}
          </Badge>
        );
      case IncidentStatus.Accepted:
        return (
          <Badge color="green" radius={"sm"}>
            {IncidentStatus.Accepted}
          </Badge>
        );
      case IncidentStatus.Rejected:
        return (
          <Badge color="red" radius={"sm"}>
            {IncidentStatus.Rejected}
          </Badge>
        );
      case undefined:
        return <></>;
    }
  };

  const orderedIncidentList = useMemo(() => {
    return _.orderBy(incidentList?.values || [], ["startTime"], ["asc"]);
  }, [incidentList]);

  const renderIncidentList = orderedIncidentList.map((row) => (
    <Box
      w={rem(300)}
      py={rem(14)}
      px={rem(18)}
      key={row?.id}
      onClick={() => {
        setSelectedIncident({ id: row?.id });
      }}
      className={
        row?.id == selectedIncident?.id
          ? classes["incident_card_active"]
          : classes["incident_card"]
      }
    >
      <Group justify="space-between">
        <Text size="md">
          {dayjs(row?.startTime).format("DD/MM/YYYY h:mm A")}
        </Text>
        {renderIncidentStatusBadge(row?.status)}
      </Group>
      <Text c="dimmed" size="sm">
        {row?.incidentType} incident
      </Text>
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
                <Box>
                  <Text fw={500} c={"dimmed"}>
                    Camera
                  </Text>
                  <Text fw={500}>{evidence?.cameraId}</Text>
                </Box>
              </Group>
            </Group>

            <Image
              radius={"md"}
              bg={"#000"}
              fit="contain"
              src={evidence?.image?.hostingUri}
            />
          </Box>
        );
    }
  };

  return (
    <Paper
      m={rem(16)}
      shadow="xs"
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
      }}
    >
      <Group
        p={rem(24)}
        pb={!opened ? rem(24) : rem(0)}
        align="center"
        justify="space-between"
      >
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Incident list
        </Text>
        <Group>
          {form.isDirty() ? (
            <Button variant="transparent" ml={"auto"} onClick={form.reset}>
              Clear all filter
            </Button>
          ) : (
            <></>
          )}

          <Button
            leftSection={<IconFilter size={14} />}
            variant="default"
            className={classes.filter_button}
            onClick={toggle}
          >
            Filter
          </Button>
        </Group>
      </Group>
      <Collapse px={rem(28)} in={opened} mb={"xl"} mt={"xs"}>
        <EditAndUpdateForm fields={fields} />
      </Collapse>
      <Flex flex={1} className={classes["body_container"]}>
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

        {selectedIncident ? (
          <ScrollArea
            style={{
              display: "flex",
              flex: 1,
            }}
            type="hover"
            mah="calc(84vh - var(--app-shell-header-height) - var(--app-shell-footer-height, 0px) )"
          >
            <Skeleton visible={isGetIncidentLoading}>
              <Box pl={rem(12)} pr={rem(32)}>
                <Group justify="space-between" align="center">
                  <Group py={rem(32)} align="center">
                    <Text size={rem(20)} fw={500}>
                      {incidentData?.incidentType} Incident -{" "}
                      {dayjs(incidentData?.startTime).format(
                        "DD/MM/YYYY h:mm A"
                      )}
                    </Text>
                    {renderIncidentStatusBadge(incidentData?.status)}
                  </Group>
                  <Tooltip label="Reject incident">
                    <ActionIcon
                      variant="filled"
                      aria-label="Settings"
                      color={"red"}
                      onClick={openModal}
                      loading={isRejectIncidentLoading}
                    >
                      <IconIdOff
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Text fw={500} size={rem(20)} mb={rem(12)}>
                  Evidence
                </Text>
                <Divider color="#acacac" mb={rem(20)} />
                {_.isEmpty(incidentData?.evidences) ? (
                  <NoImage />
                ) : (
                  incidentData?.evidences?.map((item) => {
                    return (
                      <Box key={item.id} mb={rem(20)}>
                        {renderIncidentFootage(item)}
                      </Box>
                    );
                  })
                )}

                <Box>
                  <Text fw={500} size={rem(20)} my={rem(20)}>
                    Assigned to
                  </Text>
                  <Divider color="#acacac" />

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
