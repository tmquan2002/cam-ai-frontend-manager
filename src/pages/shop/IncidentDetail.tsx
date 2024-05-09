import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Select,
  Text,
  Tooltip,
  rem
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconIdOff, IconX } from "@tabler/icons-react";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../components/badge/StatusBadge";
import BackButton from "../../components/button/BackButton";
import LoadingImage from "../../components/image/LoadingImage";
import NoImage from "../../components/image/NoImage";
import { useAssignIncident } from "../../hooks/useAssignIncident";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { useGetIncidentById } from "../../hooks/useGetIncidentById";
import { useRejectIncidentById } from "../../hooks/useRejectIncidentById";
import { EvidenceType } from "../../models/CamAIEnum";
import { EvidenceDetail } from "../../models/Evidence";
import { ResponseErrorDetail } from "../../models/Response";
import classes from "./IncidentDetail.module.scss";
import CustomBreadcrumb, { BreadcrumbItem } from "../../components/breadcrumbs/CustomBreadcrumb";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Incident",
    link: "/shop/incident"
  },
  {
    title: "Detail"
  }
]
type IncidentFormField = {
  employeeId: string | null;
};

const IncidentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>()
  const form = useForm<IncidentFormField>()
  const { data: employeeList, isLoading: isGetEmployeeListLoading } = useGetEmployeeList({})
  const { data: incidentData, isLoading: isGetIncidentLoading, refetch: refetchIncident, } = useGetIncidentById(id ?? "")
  const { mutate: rejectIncident, isLoading: isRejectIncidentLoading } = useRejectIncidentById()
  const { mutate: assignIncident, isLoading: isAssignIncidentLoading } = useAssignIncident()

  const onAssignIncident = (fieldValues: IncidentFormField) => {
    assignIncident(
      { employeeId: fieldValues.employeeId ?? "", incidentId: id ?? "" },
      {
        onSuccess() {
          notifications.show({
            title: "Assign successfully",
            message: "Incident assign success!",
          })
          refetchIncident()
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

  const openModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      confirmProps: { color: "red" },
      children: <Text size="sm">Confirm reject this incident?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        rejectIncident(id ?? "", {
          onSuccess() {
            notifications.show({
              title: "Reject successfully",
              message: "Reject assign success!",
            });
            refetchIncident();
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
                    {dayjs(evidence?.createdDate).format("DD-MM-YYYY h:mm A")}
                  </Text>
                </Box>
                <Box>
                  <Text fw={500} c={"dimmed"}>
                    Camera
                  </Text>
                  <Text
                    c={"blue"}
                    fw={500}
                    className={classes["clickable"]}
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
              imageId={evidence?.image?.id}
            />
          </Box>
        );
    }
  };

  useEffect(() => {
    if (incidentData?.employeeId) {
      form.setInitialValues({ employeeId: incidentData?.employeeId });
    } else {
      form.setInitialValues({ employeeId: null });
    }
    form.reset();
  }, [incidentData]);

  if (isGetIncidentLoading) {
    return <Loader />;
  }

  return (
    <Box>
      <Box pt={rem(20)} pl={rem(32)}>
        <CustomBreadcrumb items={breadcrumbs} goBack />
      </Box>
      <Paper px={rem(64)} mt={rem(64)} ml={rem(64)} mr={rem(20)} shadow="sm">
        <Group justify="space-between">
          <Group py={rem(32)} align="center">
            <BackButton w={rem(36)} h={rem(36)} />
            <Text size={rem(20)} fw={500}>
              {incidentData?.incidentType} Incident
            </Text>
            <Text>|</Text>
            <Text c={"dimmed"} size={rem(18)} fw={500}>
              {dayjs(incidentData?.startTime).format("DD/MM/YYYY h:mm A")}
            </Text>
            <StatusBadge statusName={incidentData?.status || "None"} size="sm" padding={10} />
          </Group>
          <Tooltip label="Reject incident">
            <ActionIcon
              variant="filled"
              aria-label="Settings"
              color={"red"}
              onClick={openModal}
              loading={isRejectIncidentLoading}
            >
              <IconIdOff style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Paper>
      <Flex>
        <Box style={{ flex: 1, }}>
          <Paper shadow="xs" mx={rem(64)} my={rem(40)} px={rem(32)} py={rem(28)}>

            <Group mb={rem(20)} justify="space-between" align="flex-end">
              <Text fw={500} size={rem(20)}>
                Evidence
              </Text>
              <Group align="flex-end">
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
            <ScrollArea h={470}>
              {_.isEmpty(incidentData?.evidences) ? (
                <NoImage type="NO_DATA" />
              ) : (
                incidentData?.evidences?.map((item) => {
                  return (
                    <Box key={item.id} mb={rem(20)}>
                      {renderIncidentFootage(item)}
                      <Divider mt={20} />
                    </Box>
                  )
                })
              )}
            </ScrollArea>
          </Paper>
        </Box>
        <Box w={rem(500)}>
          <Paper shadow="xs" mt={rem(40)} mr={rem(20)} py={rem(4)}>
            <Box px={rem(32)}>
              <Text fw={500} size={rem(20)} my={rem(20)}>
                Assigned to
              </Text>
              <Divider color="#acacac" />

              <form onSubmit={form.onSubmit(onAssignIncident)}>
                {isGetEmployeeListLoading ? (
                  <Loader mt={rem(30)} />
                ) : (
                  <Select
                    mt={rem(24)}
                    {...form.getInputProps("employeeId")}
                    placeholder="Pick value"
                    data={employeeList?.values?.map((item) => {
                      return {
                        value: item?.id,
                        label: item?.name,
                      }
                    })}
                    nothingFoundMessage="Nothing found..."
                  />
                )}

                <Group justify="flex-end" mt="md" pb={rem(20)}>
                  <Button
                    type="submit"
                    loading={isAssignIncidentLoading}
                    disabled={!form.isDirty()}
                  >
                    Confirm
                  </Button>
                </Group>
              </form>
            </Box>
          </Paper>
        </Box>
      </Flex>
    </Box>
  );
};

export default IncidentDetail;
