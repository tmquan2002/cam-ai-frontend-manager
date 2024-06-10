import {
  Box,
  Center,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Pagination,
  Paper,
  Table,
  Text,
  Tooltip,
  rem
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../components/badge/StatusBadge";
import CustomBreadcrumb, { BreadcrumbItem } from "../../components/breadcrumbs/CustomBreadcrumb";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetEmployeeById } from "../../hooks/useGetEmployeeByid";
import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { Gender } from "../../models/CamAIEnum";
import { EMAIL_REGEX, IMAGE_CONSTANT, PHONE_REGEX } from "../../types/constant";
import { mapLookupToArray } from "../../utils/helperFunction";
import classes from "./ShopEmployeeDetailPage.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Employee",
    link: "/brand/employee"
  },
  {
    title: "Detail"
  }
]
export type CreateEmployeeField = {
  name: string;
  email: string;
  gender: Gender | null;
  phone: string | null;
  birthday?: Date | null;
  addressLine: string;
  wardId: string;
  province: string;
  district: string;
};

const ShopEmployeeDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [activePage, setPage] = useState(1);

  const {
    data: employeeData,
    isLoading: isEmployeeDataLoading,
    isFetching,
  } = useGetEmployeeById(params?.id ?? "");
  const { data: incidentList, isLoading: isGetIncidentListLoading } =
    useGetIncidentList({
      size: 12,
      pageIndex: activePage - 1,
      employeeId: params?.id
    });
  const updateEmployeeForm = useForm<CreateEmployeeField>({
    initialValues: {
      name: '',
      email: '',
      gender: null,
      phone: '',
      birthday: null,
      addressLine: '',
      wardId: ``,
      province: ``,
      district: ``,
    },
    validate: {
      name: isNotEmpty("Employee name is required"),
      email: (value: string) => isEmpty(value) ? "Email is required"
        : EMAIL_REGEX.test(value) ? null : "Invalid email - ex: name@gmail.com",
      gender: isNotEmpty("Please select gender"),
      phone: (value) => isEmpty(value) || value == null ? null :
        PHONE_REGEX.test(value) ? null : "A phone number should have a length of 10-12 characters",
    },
  });

  useEffect(() => {
    if (employeeData) {
      updateEmployeeForm.setValues({
        name: employeeData?.name ?? '',
        email: employeeData?.email ?? '',
        gender: employeeData?.gender ?? null,
        phone: isEmpty(employeeData?.phone) ? null : employeeData?.phone,
        birthday: employeeData.birthday
          ? new Date(employeeData.birthday)
          : null,
        addressLine: employeeData?.addressLine ?? '',
        wardId: `${employeeData?.wardId}`,
        province: `${employeeData?.ward?.district?.provinceId}`,
        district: `${employeeData?.ward?.districtId}`,
      });
    }
  }, [employeeData, isFetching]);

  const { data: provinces, isLoading: isProvicesLoading } = useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(+(updateEmployeeForm.values.province ?? 0),);
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(+(updateEmployeeForm.values.district ?? 0),);

  const rows = incidentList?.values.map((row, index) => {
    return (
      <Tooltip label="View Incident" openDelay={300} key={index}>
        <Table.Tr
          className={classes["clickable"]}
          onClick={() => navigate(`/brand/incident/${row.id}`)}
        >
          <Table.Td>{index + 1 + Number(12) * (activePage - 1)}</Table.Td>
          <Table.Td><Text>{row.incidentType}</Text></Table.Td>
          <Table.Td>{dayjs(row?.startTime).format("DD/MM/YYYY h:mm A")}</Table.Td>
          <Table.Td ta="center">
            <StatusBadge statusName={row.status} size="sm" padding={10} />
          </Table.Td>
        </Table.Tr>
      </Tooltip>
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
          readonly: true,
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
          readonly: true,
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
          readonly: true,
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
          readonly: true,
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
          readonly: true,
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
          readonly: true,
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
          readonly: true,
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
          readonly: true,
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
          readonly: true,
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
          <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
            General Information
          </Text>
        </Group>
        {isEmployeeDataLoading ? (
          <Loader />
        ) : (
          <Box pb={rem(20)}>
            <EditAndUpdateForm fields={fields} />
          </Box>
        )}
      </Paper>

      <Paper m={rem(32)} p={rem(32)} shadow="xs">
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Incidents
        </Text>

        <Box mt={"xl"} pos={"relative"} pl={20} pr={20}>
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
              <Table
                striped
                highlightOnHover
                verticalSpacing={"md"}
              >
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
            total={Math.ceil((incidentList?.totalCount ?? 0) / 12)}
          />
        </Group>
      </Paper>
    </Box>
  );
};

export default ShopEmployeeDetailPage;
