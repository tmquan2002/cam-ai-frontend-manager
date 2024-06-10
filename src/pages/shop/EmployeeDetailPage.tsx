import {
  ActionIcon,
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
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateEmployeeParams } from "../../apis/EmployeeAPI";
import StatusBadge from "../../components/badge/StatusBadge";
import CustomBreadcrumb, {
  BreadcrumbItem,
} from "../../components/breadcrumbs/CustomBreadcrumb";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useDeleteEmployeeById } from "../../hooks/useDeleteEmployeeById";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetEmployeeById } from "../../hooks/useGetEmployeeByid";
import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useUpdateEmployeeById } from "../../hooks/useUpdateEmployeeById";
import { Gender } from "../../models/CamAIEnum";
import { ResponseErrorDetail } from "../../models/Response";
import { useTaskShop } from "../../routes/ShopRoute";
import { DEFAULT_PAGE_SIZE, EMAIL_REGEX, IMAGE_CONSTANT, PHONE_REGEX } from "../../types/constant";
import {
  mapLookupToArray
} from "../../utils/helperFunction";
import classes from "./EmployeeDetailPage.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Employee",
    link: "/shop/employee",
  },
  {
    title: "Detail",
  },
];
export type CreateEmployeeField = {
  name: string;
  email: string;
  gender: Gender | null;
  phone: string;
  birthday?: Date | null;
  addressLine: string;
  wardId: string;
  province: string;
  district: string;
};

const EmployeeDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [activePage, setPage] = useState(1);
  const { taskId } = useTaskShop();

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
      employeeId: params?.id ?? undefined,
    });
  const updateEmployeeForm = useForm<CreateEmployeeField>({
    initialValues: {
      addressLine: "",
      district: "",
      email: "",
      gender: null,
      name: "",
      phone: "",
      province: "",
      wardId: "",
      birthday: null
    },
    validate: {
      name: isNotEmpty("Employee name is required"),
      email: (value: string) => isEmpty(value) ? "Email is required"
        : EMAIL_REGEX.test(value) ? null : "Invalid email - ex: name@gmail.com",
      gender: isNotEmpty("Please select gender"),
      phone: (value) => isEmpty(value) || value == null ? null : PHONE_REGEX.test(value)
        ? null : "A phone number should have a length of 10-12 characters",
    },
  });
  const { mutate: deleteEmployee, isLoading: isDeleteEmployeeLoading } =
    useDeleteEmployeeById();

  useEffect(() => {
    if (employeeData) {
      updateEmployeeForm.setInitialValues({
        name: employeeData?.name ?? "",
        email: employeeData?.email ?? "",
        gender: employeeData?.gender ?? null,
        phone: employeeData?.phone ?? "",
        birthday: employeeData.birthday
          ? new Date(employeeData.birthday)
          : null,
        addressLine: employeeData?.addressLine ?? "",
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

  const rows = incidentList?.values.map((row, index) => {
    return (
      <Table.Tr
        key={index}
        className={classes["clickable"]}
        onClick={() => navigate(`/shop/incident/${row.id}`)}
      >
        <Table.Td>{index + 1 + Number(DEFAULT_PAGE_SIZE) * (activePage - 1)}</Table.Td>
        <Table.Td>
          <Text>{row.incidentType}</Text>
        </Table.Td>
        <Table.Td>{dayjs(row?.startTime).format("DD/MM/YYYY h:mm A")}</Table.Td>
        <Table.Td ta="center">
          <StatusBadge statusName={row.status} size="sm" padding={10} />
        </Table.Td>
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
          radius: "md",
          disabled: taskId !== undefined,
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
          radius: "md",
          disabled: taskId !== undefined,
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
          radius: "md",
          disabled: taskId !== undefined,
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
          radius: "md",
          disabled: taskId !== undefined,
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
          radius: "md",
          disabled: taskId !== undefined,
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
          radius: "md",
          disabled: taskId !== undefined,
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
          radius: "md",
          disabled: taskId !== undefined,
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
          radius: "md",
          disabled: taskId !== undefined,
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
          radius: "md",
          disabled: taskId !== undefined,
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
      <Box pt={rem(20)} pl={rem(32)}>
        <CustomBreadcrumb items={breadcrumbs} goBack />
      </Box>
      <Paper m={rem(32)} p={rem(32)} shadow="xs">
        <Group justify={"space-between"} align="center" pb={rem(28)}>
          <Group>
            <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
              General Information
            </Text>
          </Group>

          <ActionIcon color="red" onClick={open} size={"lg"} disabled={taskId !== undefined}>
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
                  gender: gender ?? null,
                  addressLine,
                  birthday: birthday
                    ? dayjs(birthday).format("YYYY-MM-DD")
                    : null,
                  phone: isEmpty(phone) ? null : phone,
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
            <Group justify="flex-end" mt="md">
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

      <Paper m={rem(32)} p={rem(32)} shadow="xs">
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Incidents
        </Text>

        <Box pl={20} pr={20} mt={"xl"} pos={"relative"}>
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
            <Table.ScrollContainer minWidth={1000}>
              <Table striped highlightOnHover verticalSpacing={"md"}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>#</Table.Th>
                    <Table.Th>Incident type</Table.Th>
                    <Table.Th>Time</Table.Th>
                    <Table.Th ta="center">Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Box>
        <Group justify="flex-end" mt="lg">
          <Pagination
            value={activePage}
            onChange={setPage}
            total={Math.ceil((incidentList?.totalCount ?? 0) / Number(DEFAULT_PAGE_SIZE))}
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
        <Group justify="flex-end" mt="md">
          <Button
            loading={isDeleteEmployeeLoading}
            onClick={() => {
              deleteEmployee(params.id ?? "", {
                onSuccess() {
                  notifications.show({
                    title: "Successfully",
                    message: "Delete employee successfully!",
                  });
                  navigate("/shop/employee");
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
          <Button onClick={close} color={"red"} variant="outline" size="xs">
            No
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};

export default EmployeeDetailPage;
