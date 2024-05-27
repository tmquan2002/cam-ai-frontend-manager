import {
  Box,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Stack,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconClock,
  IconPictureInPicture,
  IconReport,
  IconRobot,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/badge/StatusBadge";
import LoadingImage from "../../components/image/LoadingImage";
import NoImage from "../../components/image/NoImage";
import { useGetIncidentById } from "../../hooks/useGetIncidentById";
import { EvidenceType, IncidentStatus } from "../../models/CamAIEnum";
import { EvidenceDetail } from "../../models/Evidence";

type IncidentFormField = {
  employeeId: string | null;
};

const renderIncidentFootage = (evidence: EvidenceDetail) => {
  switch (evidence.evidenceType) {
    case EvidenceType.Image:
      return (
        <Box>
          <Group align="center" mb={rem(12)} gap={30}>
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

          <LoadingImage
            radius={"md"}
            bg={"#000"}
            fit="contain"
            imageId={evidence?.imageId}
          />
        </Box>
      );
  }
};

const ShopIncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const form = useForm<IncidentFormField>();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const { data: incidentData, isLoading: isGetIncidentLoading } =
    useGetIncidentById(id ?? "");

  useEffect(() => {
    if (incidentData?.employeeId) {
      form.setValues({ employeeId: incidentData?.employeeId });
    } else {
      form.setValues({ employeeId: null });
    }
  }, [incidentData]);

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isGetIncidentLoading} />
      <Paper px={rem(32)} shadow="sm">
        <Box py={rem(32)}>
          <Text
            size={rem(18)}
            fw={600}
            c={computedColorScheme == "light" ? "rgb(17, 24, 39)" : "white"}
            lh={rem(26)}
          >
            {incidentData?.incidentType} incident
          </Text>
          <Text c={"dimmed"} size={rem(14)} fw={400} lh={rem(26)}>
            {dayjs(incidentData?.startTime).format("MMMM DD, YYYY h:mm A")}
          </Text>
        </Box>
      </Paper>
      <Flex>
        <Box
          style={{
            flex: 1,
          }}
        >
          <Paper
            shadow="xs"
            mx={rem(32)}
            my={rem(40)}
            px={rem(32)}
            py={rem(28)}
          >
            <Group justify="space-between" align="flex-end" mb={rem(20)}>
              <Text fw={500} size={rem(20)}>
                Evidence
              </Text>
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
                    </Box>
                  );
                })
              )}
            </ScrollArea>
          </Paper>
        </Box>
        <Box w={rem(500)}>
          <Paper shadow="xs" mt={rem(40)} mr={rem(32)} py={rem(4)}>
            <Stack
              p={rem(24)}
              gap={4}
              style={{
                backgroundColor:
                  computedColorScheme == "light" ? "#fff" : "#1f1f1f",
              }}
            >
              <Group justify="space-between">
                <Text
                  fw={600}
                  size={rem(17)}
                  c={
                    computedColorScheme == "light" ? "rgb(17, 24, 39)" : "white"
                  }
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
            <Divider color="#ccc" />
            <Stack p={rem(24)} gap={rem(18)}>
              {incidentData?.employee && (
                <Group>
                  <IconUserCircle
                    style={{
                      width: rem(22),
                      color: computedColorScheme == "light" ? "#000" : "white",
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

              {incidentData?.assigningAccount && (
                <Group>
                  <IconUsers
                    style={{
                      width: rem(22),
                      color: computedColorScheme == "light" ? "#000" : "white",
                      aspectRatio: 1,
                    }}
                  />
                  <Text size={rem(15)} c={"dimmed"} lh={rem(24)}>
                    {incidentData?.status == IncidentStatus.Rejected
                      ? "Rejected "
                      : "Assigned "}
                    by{" "}
                    <Text
                      inherit
                      span
                      fw={500}
                      c={computedColorScheme == "light" ? "black" : "white"}
                    >
                      {incidentData?.assigningAccount?.name}
                    </Text>
                  </Text>
                </Group>
              )}
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
                    {" " + incidentData?.inChargeAccount?.name}
                  </Text>
                </Text>
              </Group>
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

              <Group>
                <IconClock
                  style={{
                    width: rem(22),
                    color: computedColorScheme == "light" ? "#000" : "white",
                    aspectRatio: 1,
                  }}
                />
                <Text size={rem(15)} c={"dimmed"} lh={rem(24)}>
                  {dayjs(incidentData?.startTime).format(
                    "MMMM DD, YYYY h:mm A"
                  )}
                </Text>
              </Group>
            </Stack>
          </Paper>
        </Box>
      </Flex>
    </Box>
  );
};

export default ShopIncidentDetailPage;
