import { useForm } from "@mantine/form";
import { IncidentStatus, IncidentType } from "../../../../models/CamAIEnum";
import { GetIncidentParams } from "../../../../apis/IncidentAPI";
import { useMemo } from "react";
import dayjs from "dayjs";
import _ from "lodash";
import { useGetIncidentList } from "../../../../hooks/useGetIncidentList";
import { useGetEmployeeList } from "../../../../hooks/useGetEmployeeList";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../../../components/form/EditAndUpdateForm";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import {
  EmployeeIncidentCard,
  EmployeeIncidentCardProps,
} from "../../../../components/card/EmployeeIncidentCard";
import { IconCheck, IconEye, IconX } from "@tabler/icons-react";

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

const EmployeeIncidentReport = () => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const form = useForm<SearchIncidentField>({
    validateInputOnChange: true,
    initialValues: {
      employeeId: null,
      fromTime: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      status: null,
      toTime: new Date(),
      incidentType: IncidentType.Incident,
      size: 999,
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
      };
      sb = _.omitBy(sb, _.isNil) as GetIncidentParams;
      return sb;
    } else {
      if (form.values.incidentType) {
        return {
          size: 999,
          incidentType: form.values.incidentType ?? undefined,
        };
      }
      return {
        size: 999,
      };
    }
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
          status: IncidentStatus.Accepted,
          employee: e,
          incidentList: [],
        };
      }
    );

    incidentArray.push({
      status: IncidentStatus.New,
      employee: null,
      incidentList: [],
    });

    incidentArray.push({
      status: IncidentStatus.Rejected,
      employee: null,
      incidentList: [],
    });

    const rejectedIndex = _.findIndex(incidentArray, function (value) {
      return value?.status == IncidentStatus.Rejected;
    });
    // Add incident to current array

    removedInteractionIncident.forEach((item) => {
      if (item.status == IncidentStatus.Rejected) {
        incidentArray[rejectedIndex].incidentList.push(item);
        return;
      }

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

    incidentArray = _.sortBy(
      incidentArray,
      function (item: EmployeeIncidentCardProps) {
        return -item.incidentList.length;
      }
    );

    //Push unassigned and rejected incident to last of array
    const unAssignedIncidentIndex = _.findIndex(incidentArray, {
      status: IncidentStatus.New,
    });

    incidentArray.push(incidentArray.splice(unAssignedIncidentIndex, 1)[0]);
    const rejectedIncidentIndex = _.findIndex(incidentArray, {
      status: IncidentStatus.Rejected,
    });
    incidentArray.push(incidentArray.splice(rejectedIncidentIndex, 1)[0]);
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
          fontWeight: 500,
          radius: rem(8),
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form,
          name: "toTime",
          placeholder: "End date",
          fontWeight: 500,
          radius: rem(8),
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          form,
          name: "incidentType",
          placeholder: "Incident type",
          fontWeight: 500,
          radius: rem(8),
          data: [
            {
              key: IncidentType.Phone,
              value: IncidentType.Phone,
            },
            {
              key: IncidentType.Uniform,
              value: IncidentType.Uniform,
            },
            {
              value: IncidentType.Incident,
              label: "All incident",
            },
          ],
        },
        spans: 4,
      },
    ];
  }, [form]);

  return (
    <Box mt={rem(20)}>
      <Box
        style={{
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginTop: rem(20),
          overflow: "hidden",
          paddingBottom: rem(40),
        }}
      >
        <Box
          mb={rem(32)}
          bg={computedColorScheme == "light" ? "white" : "#242424"}
          py={rem(20)}
          style={{
            borderBottom: "1px solid #ccc",
            backgroundColor: "#f9fafb",
          }}
        >
          <Group justify="flex-end" mr={rem(12)}>
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
                <Text size="md" fw={500}></Text>
              )}

              <Box miw={rem(360)}>
                <EditAndUpdateForm fields={fields} />
              </Box>
            </Group>
          </Group>
        </Box>

        <Box px={rem(20)}>
          {newArray?.map((item, index) => (
            <Box key={index} pt={index == 0 ? 0 : rem(12)}>
              <EmployeeIncidentCard
                status={item?.status}
                employee={item?.employee}
                incidentList={item?.incidentList}
              />
            </Box>
          ))}
          <Grid mt={rem(28)} justify="space-between" gutter={rem(40)}>
            <Grid.Col span={4}>
              <Skeleton
                visible={isGetIncidentListLoading || isGetEmployeeListLoading}
              >
                <Paper
                  px={rem(20)}
                  py={rem(20)}
                  radius={"md"}
                  style={{
                    boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.2)",
                  }}
                  bg={computedColorScheme == "light" ? "white" : "#1D1D1D"}
                >
                  <Group>
                    <Avatar
                      radius={"md"}
                      color="green"
                      size={rem(68)}
                      mr={rem(12)}
                    >
                      <IconCheck size={"2rem"} />
                    </Avatar>
                    <Stack justify="center" gap={rem(6)}>
                      <Text
                        c={computedColorScheme == "dark" ? "white" : "black"}
                        fw={500}
                      >
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
                <Paper
                  px={rem(20)}
                  py={rem(20)}
                  style={{
                    boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.2)",
                  }}
                  radius={"md"}
                  bg={computedColorScheme == "light" ? "white" : "#1D1D1D"}
                >
                  <Group>
                    <Avatar radius={"md"} color="blue" size={rem(68)}>
                      <IconEye size={"2rem"} />
                    </Avatar>
                    <Stack justify="center" gap={rem(8)}>
                      <Text
                        c={computedColorScheme == "dark" ? "white" : "black"}
                        fw={500}
                      >
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
                <Paper
                  px={rem(20)}
                  py={rem(20)}
                  style={{
                    boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.2)",
                  }}
                  radius={"md"}
                  bg={computedColorScheme == "light" ? "white" : "#1D1D1D"}
                >
                  <Group>
                    <Avatar radius={"md"} color="red" size={rem(68)}>
                      <IconX size={"2rem"} />
                    </Avatar>
                    <Stack justify="center" gap={rem(8)}>
                      <Text
                        c={computedColorScheme == "dark" ? "white" : "black"}
                        fw={500}
                      >
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
      </Box>
    </Box>
  );
};

export default EmployeeIncidentReport;
