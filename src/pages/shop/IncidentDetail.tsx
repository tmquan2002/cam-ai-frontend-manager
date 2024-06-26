import {
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  Select,
  Skeleton,
  Stack,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconClock,
  IconPictureInPicture,
  IconReport,
  IconRobot,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import LoadingImage from "../../components/image/LoadingImage";
import NoImage from "../../components/image/NoImage";
import { useAssignIncident } from "../../hooks/useAssignIncident";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { useGetIncidentById } from "../../hooks/useGetIncidentById";
import { useRejectIncidentById } from "../../hooks/useRejectIncidentById";
import {
  EvidenceType,
  IncidentStatus,
  IncidentType,
} from "../../models/CamAIEnum";
import { EvidenceDetail } from "../../models/Evidence";
import { ResponseErrorDetail } from "../../models/Response";
import classes from "./IncidentDetail.module.scss";
import { IMAGE_CONSTANT } from "../../types/constant";
import { useDisclosure } from "@mantine/hooks";
import { IconUsers } from "@tabler/icons-react";
import StatusBadge from "../../components/badge/StatusBadge";

type IncidentFormField = {
  employeeId: string | null;
};

const IncidentDetail = () => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const [opened, { open, close }] = useDisclosure(false);
  const { id } = useParams<{ id: string }>();
  const form = useForm<IncidentFormField>();
  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({});
  const {
    data: incidentData,
    isLoading: isGetIncidentLoading,
    refetch: refetchIncident,
  } = useGetIncidentById(id ?? "");
  const { mutate: rejectIncident, isLoading: isRejectIncidentLoading } =
    useRejectIncidentById();
  const { mutate: assignIncident, isLoading: isAssignIncidentLoading } =
    useAssignIncident();
  const isInteractionType = useMemo(() => {
    return incidentData?.incidentType == IncidentType.Interaction;
  }, [incidentData]);

  const onAssignIncident = (fieldValues: IncidentFormField) => {
    assignIncident(
      { employeeId: fieldValues.employeeId ?? "", incidentId: id ?? "" },
      {
        onSuccess() {
          notifications.show({
            title: "Assign successfully",
            message: "Incident assign success!",
          });
          refetchIncident();
          close();
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
      centered: true,
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
            <LoadingImage
              radius={"sm"}
              bg={"#000"}
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

  return (
    <Box
      pos="relative"
      flex={1}
      bg={computedColorScheme == "light" ? "#fff" : "#1a1a1a"}
    >
      <LoadingOverlay visible={isGetIncidentLoading} />
      <Modal
        opened={opened}
        onClose={close}
        title="Assign incident"
        styles={{
          title: {
            fontWeight: 500,
          },
        }}
      >
        <form onSubmit={form.onSubmit(onAssignIncident)}>
          {isGetEmployeeListLoading ? (
            <Loader />
          ) : (
            <Select
              {...form.getInputProps("employeeId")}
              placeholder="Pick value"
              data={employeeList?.values?.map((item) => {
                return {
                  value: item?.id,
                  label: item?.name,
                };
              })}
              radius={"md"}
              style={{
                fontWeight: 500,
              }}
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: rem(14),
                },
              }}
              nothingFoundMessage="Nothing found..."
            />
          )}

          <Group justify="flex-end" mt={rem(10)} pb={rem(10)}>
            <Button
              type="submit"
              loading={isAssignIncidentLoading}
              disabled={!form.isDirty()}
            >
              Confirm
            </Button>
          </Group>
        </form>
      </Modal>
      <Box>
        <Box
          px={rem(32)}
          py={rem(24)}
          style={{
            borderBottom: "1px solid rgb(229, 231, 235)",
          }}
        >
          <Group justify="space-between">
            <Group align="center">
              {isGetIncidentLoading ? (
                <Skeleton height={64} circle />
              ) : (
                <Avatar
                  h={60}
                  w={60}
                  src={
                    incidentData?.shop?.brand?.logo?.hostingUri ??
                    IMAGE_CONSTANT.NO_IMAGE
                  }
                  className={classes.avatar}
                />
              )}
              <Stack gap={rem(2)}>
                <Text
                  size={rem(18)}
                  fw={600}
                  c={
                    computedColorScheme == "light" ? "rgb(17, 24, 39)" : "white"
                  }
                  lh={rem(26)}
                >
                  {isInteractionType
                    ? incidentData?.incidentType
                    : incidentData?.incidentType + " incident"}
                </Text>
                <Text c={"dimmed"} size={rem(14)} fw={400} lh={rem(26)}>
                  {dayjs(incidentData?.startTime).format(
                    "MMMM DD, YYYY h:mm A"
                  )}
                </Text>
              </Stack>
            </Group>
            {!isInteractionType && (
              <Group>
                <Button
                  fw={500}
                  bg={"rgb(77,69,228)"}
                  c={"#fff"}
                  onClick={open}
                >
                  Assign
                </Button>
                {incidentData?.status != IncidentStatus.Rejected ? (
                  <Button
                    fw={500}
                    bg={"#c92a2a"}
                    c={"#fff"}
                    onClick={openModal}
                    loading={isRejectIncidentLoading}
                  >
                    Reject
                  </Button>
                ) : (
                  <></>
                )}
              </Group>
            )}
          </Group>
        </Box>
        <Group
          py={rem(28)}
          px={rem(42)}
          justify="flex-start"
          align="flex-start"
        >
          <Box
            flex={1}
            pt={rem(0)}
            mr={rem(32)}
            pb={rem(20)}
            style={{
              borderRadius: rem(8),
              border: "1px solid #ccc",
            }}
          >
            <Box
              bg={computedColorScheme == "light" ? "#f9f9f9" : "#1f1f1f"}
              py={rem(28)}
              px={rem(24)}
              style={{
                borderTopRightRadius: rem(8),
                borderTopLeftRadius: rem(8),
                borderBottom: "1px solid #ccc",
              }}
            >
              <Text size={rem(17)} fw={600}>
                Evidences
              </Text>
            </Box>

            <Box px={rem(24)} mt={rem(20)}>
              {_.isEmpty(incidentData?.evidences) ? (
                <NoImage type="NO_DATA" />
              ) : (
                incidentData?.evidences?.map((item) => {
                  return (
                    <Box key={item.id} mb={rem(12)}>
                      {renderIncidentFootage(item)}
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>
          <Box
            w={rem(440)}
            style={{
              border: "1px solid #ccc",

              borderRadius: rem(8),
            }}
          >
            <Box>
              <Stack
                gap={4}
                style={{
                  backgroundColor:
                    computedColorScheme == "light" ? "#fff" : "#1f1f1f",
                }}
              >
                <Group
                  p={rem(24)}
                  justify="space-between"
                  style={{
                    backgroundColor:
                      computedColorScheme == "light" ? "#f9f9f9" : "#1f1f1f",
                  }}
                >
                  <Text
                    fw={600}
                    size={rem(17)}
                    c={
                      computedColorScheme == "light"
                        ? "rgb(17, 24, 39)"
                        : "white"
                    }
                    lh={rem(26)}
                  >
                    {isInteractionType
                      ? incidentData?.incidentType
                      : incidentData?.incidentType + " incident"}
                  </Text>
                  {!isInteractionType && (
                    <StatusBadge
                      statusName={incidentData?.status || "None"}
                      size="sm"
                      padding={10}
                    />
                  )}
                </Group>
              </Stack>
              <Divider color="#ccc" />
              <Stack p={rem(24)} gap={rem(18)}>
                {incidentData?.employee && (
                  <Group>
                    <IconUserCircle
                      style={{
                        width: rem(22),
                        color:
                          computedColorScheme == "light" ? "#000" : "white",
                        aspectRatio: 1,
                      }}
                    />

                    <Text
                      size={rem(15)}
                      fw={500}
                      c={computedColorScheme == "light" ? "black" : "white"}
                      lh={rem(24)}
                    >
                      <Text
                        span
                        size={rem(15)}
                        lh={rem(24)}
                        inherit
                        fw={400}
                        c={"dimmed"}
                      >
                        Assign to{" "}
                      </Text>
                      {incidentData?.employee?.name}
                    </Text>
                  </Group>
                )}

                <Group>
                  <IconClock
                    style={{
                      width: rem(22),
                      color: computedColorScheme == "light" ? "#000" : "white",
                      aspectRatio: 1,
                    }}
                  />
                  <Text
                    size={rem(15)}
                    fw={500}
                    lh={rem(24)}
                    style={{
                      color:
                        computedColorScheme == "light"
                          ? "rgb(17, 24, 39)"
                          : "white",
                    }}
                  >
                    {dayjs(incidentData?.startTime).format(
                      "MMMM DD, YYYY h:mm A"
                    )}
                  </Text>
                </Group>
                {incidentData?.assigningAccount && (
                  <Group>
                    <IconUsers
                      style={{
                        width: rem(22),
                        color:
                          computedColorScheme == "light" ? "#000" : "white",
                        aspectRatio: 1,
                      }}
                    />
                    <Text size={rem(15)} c={"rgb(107, 114, 128)"} lh={rem(24)}>
                      {incidentData?.status == IncidentStatus.Rejected
                        ? "Rejected "
                        : "Assigned "}
                      by{" "}
                      <Text inherit span fw={500} c={"rgb(17, 24, 39)"}>
                        {incidentData?.assigningAccount?.name}
                      </Text>
                    </Text>
                  </Group>
                )}

                <Group>
                  <IconPictureInPicture
                    style={{
                      width: rem(22),
                      color: computedColorScheme == "light" ? "#000" : "white",
                      aspectRatio: 1,
                    }}
                  />
                  <Text size={rem(15)} c={"dimmed"} lh={rem(24)}>
                    Evidences :
                    <Text
                      inherit
                      span
                      fw={500}
                      c={computedColorScheme == "light" ? "black" : "white"}
                    >
                      {" " + incidentData?.evidences.length}
                    </Text>
                  </Text>
                </Group>
                <Group>
                  <IconReport
                    style={{
                      width: rem(22),
                      color: computedColorScheme == "light" ? "#000" : "white",
                      aspectRatio: 1,
                    }}
                  />
                  <Text size={rem(15)} c={"dimmed"} lh={rem(24)}>
                    In charge :
                    <Text
                      inherit
                      span
                      fw={500}
                      c={computedColorScheme == "light" ? "black" : "white"}
                    >
                      {" " + incidentData?.assignment?.supervisor?.name}
                    </Text>
                  </Text>
                </Group>
                <Group>
                  <IconRobot
                    style={{
                      width: rem(22),
                      color: computedColorScheme == "light" ? "#000" : "white",
                      aspectRatio: 1,
                    }}
                  />
                  <Text size={rem(15)} c={"dimmed"} lh={rem(24)}>
                    AI identity :
                    <Text
                      span
                      inherit
                      fw={500}
                      c={computedColorScheme == "light" ? "black" : "white"}
                    >
                      {" " + incidentData?.aiId}
                    </Text>
                  </Text>
                </Group>
              </Stack>
            </Box>
          </Box>
        </Group>
      </Box>
    </Box>
  );
};

export default IncidentDetail;
