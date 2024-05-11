import {
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Modal,
  Select,
  Skeleton,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlbum,
  IconCalendarMonth,
  IconIdBadge,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { IMAGE_CONSTANT } from "../../types/constant";
import { useDisclosure } from "@mantine/hooks";
import { IconUsers } from "@tabler/icons-react";
import StatusBadge from "../../components/badge/StatusBadge";

type IncidentFormField = {
  employeeId: string | null;
};

const IncidentDetail = () => {
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
    <>
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
      <Box flex={1} bg={"#fff"}>
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
                  c={"rgb(17, 24, 39)"}
                  lh={rem(26)}
                >
                  {incidentData?.incidentType} incident
                </Text>
                <Text
                  c={"rgb(55, 65, 81)"}
                  size={rem(14)}
                  fw={400}
                  lh={rem(26)}
                >
                  {dayjs(incidentData?.startTime).format(
                    "MMMM DD, YYYY h:mm A"
                  )}
                </Text>
              </Stack>
            </Group>
            <Group>
              <Button fw={500} bg={"rgb(77,69,228)"} c={"#fff"} onClick={open}>
                Assign
              </Button>
              <Button
                bg={"#fff"}
                c={"#c92a2a"}
                fw={500}
                style={{
                  borderColor: "#c92a2a",
                }}
                onClick={openModal}
                loading={isRejectIncidentLoading}
              >
                Reject
              </Button>
            </Group>
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
              bg={"#f9fafb"}
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
              border: "1px solid rgb(229, 231, 235)",

              backgroundColor: "#f9fafb",
              borderRadius: rem(8),
            }}
          >
            <Box>
              <Stack p={rem(24)} gap={4}>
                <Group justify="space-between">
                  <Text
                    fw={600}
                    size={rem(17)}
                    c={"rgb(17, 24, 39)"}
                    lh={rem(26)}
                  >
                    {incidentData?.incidentType} incident
                  </Text>
                  <StatusBadge
                    statusName={incidentData?.status || "None"}
                    size="sm"
                    padding={10}
                  />
                </Group>
              </Stack>
              <Divider color="rgb(229, 231, 235)" />
              <Stack p={rem(24)} gap={rem(18)}>
                {incidentData?.employee && (
                  <Group>
                    <IconUserCircle
                      style={{
                        width: rem(22),
                        color: "rgba(156,163,175)",
                        aspectRatio: 1,
                      }}
                    />

                    <Text
                      size={rem(15)}
                      fw={500}
                      c={"rgb(17, 24, 39)"}
                      lh={rem(24)}
                    >
                      <Text
                        span
                        size={rem(15)}
                        lh={rem(24)}
                        inherit
                        fw={400}
                        c={"rgb(107, 114, 128)"}
                      >
                        Assign to{" "}
                      </Text>
                      {incidentData?.employee?.name}
                    </Text>
                  </Group>
                )}

                <Group>
                  <IconCalendarMonth
                    style={{
                      width: rem(22),
                      color: "rgb(156,163,175)",
                      aspectRatio: 1,
                    }}
                  />
                  <Text size={rem(15)} c={"rgb(107, 114, 128)"} lh={rem(24)}>
                    {dayjs(incidentData?.startTime).format(
                      "MMMM DD, YYYY h:mm A"
                    )}
                  </Text>
                </Group>
                <Group>
                  <IconUsers
                    style={{
                      width: rem(22),
                      color: "rgba(156,163,175)",
                      aspectRatio: 1,
                    }}
                  />
                  <Text size={rem(15)} c={"rgb(107, 114, 128)"} lh={rem(24)}>
                    Assign by{" "}
                    <Text inherit span fw={500} c={"rgb(17, 24, 39)"}>
                      Someone
                    </Text>
                  </Text>
                </Group>
                <Group>
                  <IconAlbum
                    style={{
                      width: rem(22),
                      color: "rgba(156,163,175)",
                      aspectRatio: 1,
                    }}
                  />
                  <Text size={rem(15)} c={"rgb(107, 114, 128)"} lh={rem(24)}>
                    {incidentData?.evidences.length} evidences
                  </Text>
                </Group>
                <Group>
                  <IconIdBadge
                    style={{
                      width: rem(22),
                      color: "rgba(156,163,175)",
                      aspectRatio: 1,
                    }}
                  />
                  <Text size={rem(15)} c={"rgb(107, 114, 128)"} lh={rem(24)}>
                    AI identity : {incidentData?.aiId}
                  </Text>
                </Group>
              </Stack>
              {/* <Divider color="rgb(229, 231, 235)" />
              <Box p={rem(24)}></Box> */}
            </Box>
          </Box>
        </Group>
      </Box>
    </>
  );
};

export default IncidentDetail;
