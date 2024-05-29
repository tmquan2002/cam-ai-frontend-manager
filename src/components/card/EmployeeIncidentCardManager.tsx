import {
  Badge,
  Box,
  Collapse,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCategory,
  IconChevronDown,
  IconClockHour5,
  IconExclamationCircle,
  IconMail,
  IconPhone,
  IconPointFilled,
  IconUser,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { IncidentStatus } from "../../models/CamAIEnum";
import { EmployeeDetail } from "../../models/Employee";
import { IncidentDetail } from "../../models/Incident";
import classes from "./EmployeeIncidentCard.module.scss";

export type EmployeeIncidentCardProps = {
  status: IncidentStatus;
  employee: EmployeeDetail | null;
  incidentList: IncidentDetail[];
};

const renderIncidentTitle = ({
  employee,
  status,
}: {
  status: IncidentStatus;
  employee: EmployeeDetail | null;
}) => {
  switch (status) {
    case IncidentStatus.Accepted:
      return (
        <Stack py={rem(12)} gap={rem(3)} ml={rem(20)}>
          <Group align="center">
            <IconUser style={{ width: rem(20) }} stroke={1.5} />
            <Text size={"md"} fw={500}>
              {employee?.name ?? "Empty"}
            </Text>
          </Group>
          <Group align="center">
            <IconMail style={{ width: rem(20) }} stroke={1.5} />
            <Text fw={500} c={"dimmed"}>
              {employee?.email ?? "Empty"}
            </Text>
            <IconPointFilled style={{ width: rem(16) }} stroke={1.5} />
            <IconPhone style={{ width: rem(20) }} stroke={1.5} />
            <Text fw={500} c={"dimmed"}>
              {employee?.phone ?? "Empty"}
            </Text>
          </Group>
        </Stack>
      );
    case IncidentStatus.New:
      return (
        <Text fw={500} py={rem(20)} ml={rem(20)} c={"blue"}>
          Unassigned incident
        </Text>
      );
    case IncidentStatus.Rejected:
      return (
        <Text fw={500} py={rem(20)} ml={rem(20)} c={"red"}>
          Rejected incident
        </Text>
      );
  }
};

const renderIncidentStatusText = (status: IncidentStatus | undefined) => {
  switch (status) {
    case IncidentStatus.Accepted:
      return (
        <>
          <IconExclamationCircle
            color="green"
            style={{ width: rem(22) }}
            stroke={1.5}
          />
          <Text fw={500} c={"green"}>
            {IncidentStatus.Accepted}
          </Text>
        </>
      );
    case IncidentStatus.New:
      return (
        <>
          <IconExclamationCircle
            color="orange"
            style={{ width: rem(22) }}
            stroke={1.5}
          />
          <Text c={"yellow"}>{IncidentStatus.New}</Text>
        </>
      );
    case IncidentStatus.Rejected:
      return (
        <>
          <IconExclamationCircle
            color="red"
            style={{ width: rem(22) }}
            stroke={1.5}
          />
          <Text c={"red"}>{IncidentStatus.Rejected}</Text>
        </>
      );
    case undefined:
      return <Text c={"gray"}>undefined</Text>;
  }
};

export const EmployeeIncidentCardManager = ({
  status,
  employee,
  incidentList,
}: EmployeeIncidentCardProps) => {
  const [opened, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();

  return (
    <Box>
      <Group
        justify="space-between"
        align="center"
        className={
          opened
            ? classes["incident-button-active"]
            : classes["incident-button"]
        }
        pr={rem(20)}
        onClick={toggle}
      >
        <Group gap={0}>
          {opened ? (
            <> </>
          ) : (
            <Divider
              orientation="vertical"
              size={"md"}
              color={
                status == IncidentStatus.Accepted
                  ? "indigo"
                  : status == IncidentStatus.Rejected
                  ? "red"
                  : "blue"
              }
            />
          )}

          {renderIncidentTitle({ status, employee })}
        </Group>

        <Group align="center" py={rem(12)}>
          <Badge>{incidentList?.length}</Badge>
          <IconChevronDown style={{ width: rem(20) }} stroke={1.5} />
        </Group>
      </Group>

      <Collapse in={opened}>
        <Stack
          mb={rem(12)}
          gap={0}
          onClick={toggle}
          className={classes["incident-collapse"]}
        >
          {incidentList?.length == 0 ? (
            <Text p={rem(20)}>No incident found</Text>
          ) : (
            incidentList?.map((item, index) => (
              <Grid
                px={rem(20)}
                py={rem(20)}
                columns={24}
                key={item?.id}
                style={
                  index == incidentList?.length - 1
                    ? {}
                    : {
                        borderBottom: "1px solid #B4B4B4",
                      }
                }
                pb={rem(12)}
                className={classes["clickable-style"]}
                onClick={() => navigate(`/brand/incident/${item?.id}`)}
              >
                <Grid.Col span={4}>
                  <Group>
                    <IconClockHour5 style={{ width: rem(22) }} stroke={1.5} />
                    <Text>
                      {dayjs(item?.startTime).format("HH:mm | DD-MM-YYYY")}
                    </Text>
                  </Group>
                </Grid.Col>

                <Grid.Col span={3}>
                  <Group>
                    <IconCategory style={{ width: rem(22) }} stroke={1.5} />
                    <Text>{item?.incidentType}</Text>
                  </Group>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Group>{renderIncidentStatusText(item?.status)}</Group>
                </Grid.Col>
              </Grid>
            ))
          )}
        </Stack>
      </Collapse>
    </Box>
  );
};
