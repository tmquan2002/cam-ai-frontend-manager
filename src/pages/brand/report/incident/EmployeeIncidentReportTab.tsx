import { useForm } from "@mantine/form";
import { IncidentStatus, IncidentType } from "../../../../models/CamAIEnum";
import { GetIncidentParams } from "../../../../apis/IncidentAPI";
import { useMemo } from "react";
import dayjs from "dayjs";
import _ from "lodash";
import { useGetIncidentList } from "../../../../hooks/useGetIncidentList";
import { useGetEmployeeList } from "../../../../hooks/useGetEmployeeList";
import {
  EmployeeIncidentCard,
  EmployeeIncidentCardProps,
} from "../../../../components/card/EmployeeIncidentCard";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../../../components/form/EditAndUpdateForm";
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { IconCheck, IconEye, IconX } from "@tabler/icons-react";

export type EmployeeIncidentReportTabProps = {
  shopId: string | null;
};

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

const EmployeeIncidentReportTab = ({
  shopId,
}: EmployeeIncidentReportTabProps) => {
  const form = useForm<SearchIncidentField>({
    validateInputOnChange: true,
    initialValues: {
      employeeId: null,
      fromTime: null,
      status: null,
      toTime: null,
      incidentType: null,
      size: 999,
      shopId: shopId ?? undefined,
    },
    validate: (values) => ({
      toTime:
        values.toTime &&
        values?.fromTime &&
        values?.toTime?.getTime() < values?.fromTime?.getTime()
          ? "End date must be after start date"
          : null,
      fromTime:
        values.toTime &&
        values?.fromTime &&
        values?.toTime?.getTime() < values?.fromTime?.getTime()
          ? "Start date must be before end date"
          : null,
    }),
  });

  const searchParams: GetIncidentParams = useMemo(() => {
    if (form.isValid() && form.values.fromTime && form.values.toTime) {
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
        shopId: shopId,
      };
      sb = _.omitBy(sb, _.isNil) as GetIncidentParams;
      return sb;
    } else {
      if (form.values.incidentType) {
        return {
          size: 999,
          incidentType: form.values.incidentType ?? undefined,
          shopId: shopId,
        };
      }
      return {
        size: 999,
        shopId: shopId,
      };
    }
  }, [
    form.values.employeeId,
    form.values.fromTime,
    form.values.incidentType,
    form.values.status,
    form.values.toTime,
    shopId,
  ]);
  const { data: incidentList, isLoading: isGetIncidentListLoading } =
    useGetIncidentList(searchParams);

  console.log(
    incidentList?.values?.filter(
      (i) => i.incidentType != IncidentType.Interaction
    ).length
  );

  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({ size: 999 });

  const removedInteractionIncident = useMemo(() => {
    if (isGetEmployeeListLoading) {
      return [];
    } else {
      return incidentList?.values?.filter(
        (item) => item?.incidentType != IncidentType.Interaction
      );
    }
  }, [incidentList, isGetIncidentListLoading]);

  const newArray = useMemo(() => {
    if (!employeeList || !removedInteractionIncident) return [];

    // Initial employee incident array

    var incidentArray: EmployeeIncidentCardProps[] = employeeList?.values?.map(
      (e) => {
        return {
          employee: e,
          incidentList: [],
        };
      }
    );

    incidentArray.push({
      employee: null,
      incidentList: [],
    });

    // Add incident to current array

    if (removedInteractionIncident.length != 0) {
      removedInteractionIncident.forEach((item) => {
        const existingEmployeeIndex = _.findIndex(
          incidentArray,
          function (value) {
            return value?.employee?.id == item?.employeeId;
          }
        );
        if (existingEmployeeIndex != -1) {
          incidentArray[existingEmployeeIndex].incidentList.push(item);
        }
      });
    }

    // Push unassigned incident to last of array
    const unAssignedIncidentIndex = _.findIndex(incidentArray, {
      employee: null,
    });
    if (unAssignedIncidentIndex != -1) {
      incidentArray.push(incidentArray.splice(unAssignedIncidentIndex, 1)[0]);
    }
    return incidentArray;
  }, [removedInteractionIncident, employeeList]);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form,
          name: "fromTime",
          placeholder: "Start date",
          type: "range",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form,
          name: "toTime",
          placeholder: "End date",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          form,
          name: "incidentType",
          placeholder: "Incident type",
          data: [
            {
              key: IncidentType.Phone,
              value: IncidentType.Phone,
            },
            {
              key: IncidentType.Uniform,
              value: IncidentType.Uniform,
            },
          ],
        },
        spans: 4,
      },
    ];
  }, [form]);

  return (
    <Box>
      <Card
        style={{
          borderBottom: "1px solid #ccc",
        }}
        pb={rem(32)}
        shadow="md"
      >
        <Card.Section withBorder inheritPadding mb={rem(32)}>
          <Group justify="flex-end" my={rem(20)}>
            <Group>
              {form.isDirty() ? (
                <Button
                  variant="transparent"
                  p={0}
                  size="md"
                  fw={500}
                  onClick={form.reset}
                >
                  Reset
                </Button>
              ) : (
                <Text size="md" fw={500}>
                  Filter
                </Text>
              )}

              <Box miw={rem(360)}>
                <EditAndUpdateForm fields={fields} />
              </Box>
            </Group>
          </Group>
        </Card.Section>

        {newArray?.map((item, index) => (
          <Box key={index} pt={index == 0 ? 0 : rem(12)}>
            <EmployeeIncidentCard
              employee={item?.employee}
              incidentList={item?.incidentList}
            />
          </Box>
        ))}
      </Card>

      <Grid mt={rem(28)} justify="space-between" gutter={rem(40)}>
        <Grid.Col span={4}>
          <Skeleton
            visible={isGetIncidentListLoading || isGetEmployeeListLoading}
          >
            <Paper px={rem(20)} py={rem(20)} radius={"md"} shadow="lg">
              <Group>
                <Avatar radius={"md"} color="green" size={rem(68)} mr={rem(12)}>
                  <IconCheck size={"2rem"} />
                </Avatar>
                <Stack justify="center" gap={rem(6)}>
                  <Text c="#000" fw={500}>
                    Assigned incident
                  </Text>
                  <Text size={rem(22)} fw={700} c={"green"}>
                    {
                      removedInteractionIncident?.filter(
                        (i) => i.status == IncidentStatus.Accepted
                      ).length
                    }
                  </Text>
                </Stack>
              </Group>
            </Paper>
          </Skeleton>
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton
            visible={isGetIncidentListLoading || isGetEmployeeListLoading}
          >
            <Paper px={rem(20)} py={rem(20)} shadow="lg" radius={"md"}>
              <Group>
                <Avatar radius={"md"} color="blue" size={rem(68)}>
                  <IconEye size={"2rem"} />
                </Avatar>
                <Stack justify="center" gap={rem(8)}>
                  <Text c="#000" fw={500}>
                    Unassigned incident
                  </Text>
                  <Text size={rem(22)} fw={700} c={"blue"}>
                    {
                      removedInteractionIncident?.filter(
                        (i) => i.status == IncidentStatus.New
                      ).length
                    }
                  </Text>
                </Stack>
              </Group>
            </Paper>
          </Skeleton>
        </Grid.Col>

        <Grid.Col span={4}>
          <Skeleton
            visible={isGetIncidentListLoading || isGetEmployeeListLoading}
          >
            <Paper px={rem(20)} py={rem(20)} shadow="lg" radius={"md"}>
              <Group>
                <Avatar radius={"md"} color="red" size={rem(68)}>
                  <IconX size={"2rem"} />
                </Avatar>
                <Stack justify="center" gap={rem(8)}>
                  <Text c="#000" fw={500}>
                    Rejected incident
                  </Text>
                  <Text size={rem(22)} fw={700} c={"red"}>
                    {
                      removedInteractionIncident?.filter(
                        (i) => i.status == IncidentStatus.Rejected
                      ).length
                    }
                  </Text>
                </Stack>
              </Group>
            </Paper>
          </Skeleton>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default EmployeeIncidentReportTab;
