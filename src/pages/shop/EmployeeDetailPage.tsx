import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useEffect, useMemo, useState } from "react";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Mark,
  Modal,
  Pagination,
  Paper,
  Table,
  Text,
  rem,
} from "@mantine/core";
import { useGetEmployeeById } from "../../hooks/useGetEmployeeByid";
import { useDisclosure } from "@mantine/hooks";
import { useUpdateEmployeeById } from "../../hooks/useUpdateEmployeeById";
import { UpdateEmployeeParams } from "../../apis/EmployeeAPI";
import dayjs from "dayjs";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useDeleteEmployeeById } from "../../hooks/useDeleteEmployeeById";
import { getDateFromSetYear, mapLookupToArray } from "../../utils/helperFunction";
import { Gender, IncidentStatus } from "../../models/CamAIEnum";
import BackButton from "../../components/button/BackButton";
import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import classes from "./EmployeeDetailPage.module.scss";
import { IMAGE_CONSTANT, phoneRegex } from "../../types/constant";
import { isEmpty } from "lodash";

export type CreateEmployeeField = {
  name: string;
  email: string;
  gender: Gender;
  phone: string;
  birthday?: Date;
  addressLine: string;
  wardId: string;
  province: string;
  district: string;
};

const EmployeeDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [activePage, setPage] = useState(1);

  const [opened, { open, close }] = useDisclosure(false);
  const {
    data: employeeData,
    isLoading: isEmployeeDataLoading,
    refetch,
    isFetching,
  } = useGetEmployeeById(params?.id ?? "");
  const { data: incidentList, isLoading: isGetIncidentListLoading } =
    useGetIncidentList({
      size: 12,
      pageIndex: activePage - 1,
      employeeId: params?.id ?? undefined
    });
  const updateEmployeeForm = useForm<CreateEmployeeField>({
    validate: {
      name: isNotEmpty("Employee name is required"),
      email: isEmail("Invalid email - ex: helloitsme@gmail.com"),
      gender: isNotEmpty("Please select gender"),
      phone: (value) => isEmpty(value) ? null :
        phoneRegex.test(value) ? null : "A phone number should have a length of 10-12 characters",
    },
  });
  const { mutate: deleteEmployee, isLoading: isDeleteEmployeeLoading } =
    useDeleteEmployeeById();

  useEffect(() => {
    if (employeeData) {
      updateEmployeeForm.setInitialValues({
        name: employeeData?.name ?? undefined,
        email: employeeData?.email ?? undefined,
        gender: employeeData?.gender ?? undefined,
        phone: employeeData?.phone ?? undefined,
        birthday: employeeData.birthday
          ? new Date(employeeData.birthday)
          : undefined,
        addressLine: employeeData?.addressLine ?? undefined,
        wardId: `${employeeData?.wardId}`,
        province: `${employeeData?.ward?.district?.provinceId}`,
        district: `${employeeData?.ward?.districtId}`,
      });
      updateEmployeeForm.reset();
    }
  }, [employeeData, isFetching]);

  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(updateEmployeeForm.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(updateEmployeeForm.values.district ?? 0)
  );

  const { mutate: updateEmployee, isLoading: isUpdateEmployeeLoading } =
    useUpdateEmployeeById();

  const renderIncidentStatusBadge = (status: IncidentStatus | undefined) => {
    switch (status) {
      case IncidentStatus.New:
        return <Badge color="yellow">{IncidentStatus.New}</Badge>;
      case IncidentStatus.Accepted:
        return <Badge color="green">{IncidentStatus.Accepted}</Badge>;
      case IncidentStatus.Rejected:
        return <Badge color="red">{IncidentStatus.Rejected}</Badge>;
      case undefined:
        <></>;
    }
  };

  const rows = incidentList?.values.map((row, index) => {
    return (
      <Table.Tr
        key={index}
        className={classes["clickable"]}
        onClick={() => navigate(`/shop/incident/${row.id}`)}
      >
        <Table.Td>
          <Text>{row.incidentType}</Text>
        </Table.Td>
        <Table.Td>{dayjs(row?.startTime).format("DD/MM/YYYY h:mm A")}</Table.Td>
        <Table.Td>
          <Text
            className={classes["pointer-style"]}
            c={"blue"}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/shop/employee/${row?.employee?.id}`);
            }}
          >
            {row?.employee?.name}
          </Text>
        </Table.Td>

        <Table.Td>{renderIncidentStatusBadge(row?.status)}</Table.Td>
      </Table.Tr>
    );
  });

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: updateEmployeeForm,
          name: "name",
          placeholder: "Name",
          label: "Name",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: updateEmployeeForm,
          name: "email",
          placeholder: "Email",
          label: "Email",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Gender",
          placeholder: "Gender",
          data: mapLookupToArray(Gender ?? {}),
          form: updateEmployeeForm,
          name: "gender",
          required: true,
        },
        spans: 6,
      },

      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: updateEmployeeForm,
          name: "phone",
          type: "number",
          placeholder: "Phone",
          label: "Phone",
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form: updateEmployeeForm,
          name: "birthday",
          placeholder: "Birthday",
          label: "Birthday",
          maxDate: getDateFromSetYear(18)
        },
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Province",
          placeholder: "Province",
          data: provinces?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: updateEmployeeForm,
          name: "province",
          loading: isProvicesLoading,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "District",
          placeholder: "District",
          data: districts?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: updateEmployeeForm,
          name: "district",
          loading: isDistrictsLoading,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Ward",
          placeholder: "Ward",
          data: wards?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: updateEmployeeForm,
          name: "wardId",
          loading: isWardsLoading,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: updateEmployeeForm,
          name: "addressLine",
          placeholder: "Employee address",
          label: "Employee address",
        },
      },
    ];
  }, [
    updateEmployeeForm,
    districts,
    isDistrictsLoading,
    isProvicesLoading,
    isWardsLoading,
    provinces,
    wards,
  ]);

  return (
    <Box pb={rem(40)}>
      <Paper
        m={rem(32)}
        p={rem(32)}
        shadow="xs"
      >
        <Group
          justify={"space-between"}
          align="center"
          pb={rem(28)}
        >
          <Group>
            <BackButton />

            <Text
              size="lg"
              fw={"bold"}
              fz={25}
              c={"light-blue.4"}
            >
              Employee - {employeeData?.name}
            </Text>
          </Group>

          <ActionIcon
            color="red"
            onClick={open}
            size={"lg"}
          >
            <IconTrash style={{ width: rem(20), height: rem(20) }} />
          </ActionIcon>
        </Group>
        {isEmployeeDataLoading ? (
          <Loader />
        ) : (
          <form
            onSubmit={updateEmployeeForm.onSubmit(
              ({
                name,
                addressLine,
                birthday,
                email,
                gender,
                phone,
                wardId,
              }) => {
                const createEmployeeParams: UpdateEmployeeParams = {
                  email: email ?? "",
                  name: name ?? "",
                  gender: gender ?? "",
                  addressLine,
                  birthday: birthday
                    ? dayjs(birthday).format("YYYY-MM-DD")
                    : null,
                  phone,
                  wardId: wardId ? +wardId : null,
                };
                updateEmployee(
                  { ...createEmployeeParams, employeeId: params.id ?? "" },
                  {
                    onSuccess() {
                      refetch();

                      notifications.show({
                        title: "Successfully",
                        message: "Update employee successfully!",
                      });
                    },
                    onError(data) {
                      const error = data as AxiosError<ResponseErrorDetail>;
                      notifications.show({
                        color: "red",
                        title: "Failed",
                        message: error.response?.data?.message,
                      });
                    },
                  }
                );
              }
            )}
          >
            <EditAndUpdateForm fields={fields} />
            <Group
              justify="flex-end"
              mt="md"
            >
              <Button
                type="submit"
                disabled={!updateEmployeeForm.isDirty()}
                loading={isUpdateEmployeeLoading}
              >
                Update
              </Button>
            </Group>
          </form>
        )}
      </Paper>

      <Paper
        m={rem(32)}
        p={rem(32)}
        shadow="xs"
      >
        <Text
          size="lg"
          fw={"bold"}
          fz={25}
          c={"light-blue.4"}
        >
          Incidents
        </Text>

        <Box
          mt={"xl"}
          pos={"relative"}
        >
          <LoadingOverlay
            visible={isGetIncidentListLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 1 }}
          />
          {incidentList?.isValuesEmpty ? (
            <Center>
              <Image
                radius={"md"}
                src={IMAGE_CONSTANT.NO_DATA}
                fit="contain"
                h={rem(400)}
                w={"auto"}
                style={{
                  borderBottom: "1px solid #dee2e6",
                }}
              />
            </Center>
          ) : (
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              verticalSpacing={"md"}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Incident type</Table.Th>
                  <Table.Th>Time</Table.Th>
                  <Table.Th>Assigned to</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          )}
        </Box>
        <Group
          justify="flex-end"
          mt="lg"
        >
          <Pagination
            value={activePage}
            onChange={setPage}
            total={Math.ceil((incidentList?.totalCount ?? 0) / 12)}
          />
        </Group>
      </Paper>

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text>
            Confirm delete <Mark>{employeeData?.name}</Mark> employee?
          </Text>
        }
      // centered
      >
        <Group
          justify="flex-end"
          mt="md"
        >
          <Button
            loading={isDeleteEmployeeLoading}
            onClick={() => {
              deleteEmployee(params.id ?? "", {
                onSuccess() {
                  notifications.show({
                    title: "Successfully",
                    message: "Delete employee successfully!",
                  });
                  navigate("/shop/detail");
                },
                onError(data) {
                  const error = data as AxiosError<ResponseErrorDetail>;
                  notifications.show({
                    color: "red",
                    title: "Failed",
                    message: error.response?.data?.message,
                  });
                },
              });
            }}
            variant="filled"
            size="xs"
          >
            Yes
          </Button>
          <Button
            onClick={close}
            color={"red"}
            variant="outline"
            size="xs"
          >
            No
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};

export default EmployeeDetailPage;
