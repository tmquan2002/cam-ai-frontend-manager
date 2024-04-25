import {
  Badge,
  Box,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  Select,
  Text,
  rem,
} from "@mantine/core";
import BackButton from "../../components/button/BackButton";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { EvidenceType, IncidentStatus } from "../../models/CamAIEnum";
import { useGetIncidentById } from "../../hooks/useGetIncidentById";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { EvidenceDetail } from "../../models/Evidence";
import NoImage from "../../components/image/NoImage";
import _ from "lodash";
import LoadingImage from "../../components/image/LoadingImage";

type IncidentFormField = {
  employeeId: string | null;
};

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

const renderIncidentStatusBadge = (status: IncidentStatus | undefined) => {
  switch (status) {
    case IncidentStatus.New:
      return <Badge color="yellow">{IncidentStatus.New}</Badge>;
    case IncidentStatus.Accepted:
      return <Badge color="green">{IncidentStatus.Accepted}</Badge>;
    case IncidentStatus.Rejected:
      return <Badge color="red">{IncidentStatus.Rejected}</Badge>;
    case undefined:
      return <></>;
  }
};

const ShopIncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const form = useForm<IncidentFormField>();

  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({});

  const { data: incidentData, isLoading: isGetIncidentLoading } =
    useGetIncidentById(id ?? "");

  useEffect(() => {
    if (incidentData?.employeeId) {
      form.setValues({ employeeId: incidentData?.employeeId });
    } else {
      form.setValues({ employeeId: null });
    }
  }, [incidentData]);

  if (isGetIncidentLoading) {
    return <Loader />;
  }

  return (
    <Box>
      <Group px={rem(64)} bg={"white"} justify="space-between" align="center">
        <Group py={rem(32)} align="center">
          <BackButton color="#000" w={rem(36)} h={rem(36)} />
          <Text size={rem(20)} fw={500}>
            {incidentData?.incidentType} Incident -{" "}
            {dayjs(incidentData?.startTime).format("DD/MM/YYYY h:mm A")}
          </Text>
          {renderIncidentStatusBadge(incidentData?.status ?? undefined)}
        </Group>
      </Group>
      <Divider />
      <Flex>
        <Box
          style={{
            flex: 1,
          }}
        >
          <Paper
            shadow="xs"
            mx={rem(64)}
            my={rem(40)}
            px={rem(32)}
            py={rem(28)}
          >
            <Group justify="space-between" align="flex-end" mb={rem(20)}>
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
          </Paper>
        </Box>
        <Box w={rem(500)}>
          <Paper shadow="xs" mt={rem(40)} mr={rem(20)} py={rem(4)}>
            <Box px={rem(32)} pb={rem(32)}>
              <Text fw={500} size={rem(20)} my={rem(20)}>
                Assigned to
              </Text>
              <Divider color="#acacac" />
              {isGetEmployeeListLoading ? (
                <Loader mt={rem(30)} />
              ) : (
                <Select
                  mt={rem(24)}
                  {...form.getInputProps("employeeId")}
                  placeholder="No employee assigned"
                  data={employeeList?.values?.map((item) => {
                    return {
                      value: item?.id,
                      label: item?.name,
                    };
                  })}
                  readOnly
                  nothingFoundMessage="Nothing found..."
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Flex>
    </Box>
  );
};

export default ShopIncidentDetailPage;
