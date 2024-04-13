import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import {
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  Text,
  rem,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import classes from "./ShopInteractionPage.module.scss";
import {
  EvidenceType,
  IncidentStatus,
  IncidentType,
} from "../../models/CamAIEnum";
import { IconFilter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useForm } from "@mantine/form";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { GetIncidentParams } from "../../apis/IncidentAPI";
import dayjs from "dayjs";
import _ from "lodash";
import { useGetIncidentById } from "../../hooks/useGetIncidentById";
import { EvidenceDetail } from "../../models/Evidence";
import NoImage from "../../components/image/NoImage";
import { useNavigate } from "react-router-dom";
import LoadingImage from "../../components/image/LoadingImage";

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

const ShopInteractionPage = () => {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const [selectedIncident, setSelectedIncident] = useState<{
    id: string;
  } | null>(null);

  const assignIncidentForm = useForm<IncidentFormField>();

  const form = useForm<SearchIncidentField>({
    initialValues: {
      employeeId: null,
      fromTime: null,
      status: null,
      toTime: null,
      incidentType: IncidentType.Interaction,
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

  const { data: incidentList, isLoading: isGetIncidentListLoading } =
    useGetIncidentList(searchParams);

  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({});

  const { data: incidentData, isLoading: isGetIncidentLoading } =
    useGetIncidentById(selectedIncident?.id ?? null);

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

  const fields = useMemo(() => {
    return [
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
    return _.orderBy(incidentList?.values || [], ["startTime"], ["desc"]);
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

        {new Date(row?.startTime).getTime() - new Date().getTime() > 0 ? (
          renderIncidentStatusBadge(IncidentStatus.New)
        ) : (
          <></>
        )}
      </Group>
      <Text c="dimmed" size="sm">
        {row?.incidentType}
      </Text>
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
                  <Text
                    fw={500}
                    c={"blue"}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate(`/shop/camera/${evidence?.cameraId}`)
                    }
                  >
                    View camera
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
          Interaction list
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
                      {incidentData?.incidentType} Incident
                    </Text>
                    <Text>|</Text>
                    <Text size={rem(20)} fw={500} c={"dimmed"}>
                      {" "}
                      {dayjs(incidentData?.startTime).format(
                        "DD/MM/YYYY h:mm A"
                      )}
                    </Text>
                    {new Date(incidentData?.startTime ?? "").getTime() -
                      new Date().getTime() >
                    0 ? (
                      renderIncidentStatusBadge(IncidentStatus.New)
                    ) : (
                      <></>
                    )}
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

export default ShopInteractionPage;
