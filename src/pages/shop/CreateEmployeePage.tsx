import { Box, Button, Group, Modal, Paper, Text, rem } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import _, { isEmpty } from "lodash";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreateEmployeeParams } from "../../apis/EmployeeAPI";
import CustomBreadcrumb, {
  BreadcrumbItem,
} from "../../components/breadcrumbs/CustomBreadcrumb";
import DownloadButton from "../../components/button/DownloadButton";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useCreateEmployee } from "../../hooks/useCreateEmployee";
import { useUploadEmployeeFile } from "../../hooks/useFiles";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { Gender } from "../../models/CamAIEnum";
import { ResponseErrorDetail } from "../../models/Response";
import { EMAIL_REGEX } from "../../types/constant";
import { getDateFromSetYear, mapLookupToArray } from "../../utils/helperFunction";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Employee",
    link: "/shop/employee",
  },
  {
    title: "Add",
  },
];
export type CreateEmployeeField = {
  name: string | null;
  email: string;
  gender: Gender;
  phone: string | null;
  birthday: Date | null;
  addressLine: string | null;
  wardId: number | null;
  province: string | null;
  district: string | null;
};
const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const [openedMassImport, { open: openMassImport, close: closeMassImport }] =
    useDisclosure(false);

  const createEmployeeForm = useForm<CreateEmployeeField>({
    initialValues: {
      name: "",
      email: "",
      gender: Gender.Male,
      phone: "",
      birthday: null,
      addressLine: "",
      wardId: null,
      province: "",
      district: "",
    },
    validate: {
      name: isNotEmpty("Employee name is required"),
      email: (value) => isEmpty(value) ? null
        : EMAIL_REGEX.test(value) ? null : "Invalid email - ex: name@gmail.com",
      gender: isNotEmpty("Please select gender"),
    },
  });

  const massImportForm = useForm<{ file: File }>({
    validate: {
      file: isNotEmpty("Please choose a file"),
    },
  });

  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(createEmployeeForm.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(createEmployeeForm.values.district ?? 0)
  );
  const { mutate: craeteEmployee, isLoading: isCreateEmployeeLoading } =
    useCreateEmployee();
  const { mutate: uploadEmployee, isLoading: isUploadEmployeeLoading } =
    useUploadEmployeeFile();

  const createEmployeeFields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createEmployeeForm,
          name: "name",
          placeholder: "Name",
          label: "Name",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createEmployeeForm,
          name: "email",
          placeholder: "Email",
          label: "Email",
        },
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Gender",
          placeholder: "Gender",
          data: mapLookupToArray(Gender ?? {}),
          form: createEmployeeForm,
          name: "gender",
          required: true,
        },
        spans: 6,
      },

      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createEmployeeForm,
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
          form: createEmployeeForm,
          name: "birthday",
          placeholder: "Birthday",
          label: "Birthday",
          maxDate: getDateFromSetYear(18),
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
          form: createEmployeeForm,
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
          form: createEmployeeForm,
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
          form: createEmployeeForm,
          name: "wardId",
          loading: isWardsLoading,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createEmployeeForm,
          name: "addressLine",
          placeholder: "Employee address",
          label: "Employee address",
        },
      },
    ];
  }, [
    createEmployeeForm,
    districts,
    isDistrictsLoading,
    isProvicesLoading,
    isWardsLoading,
    provinces,
    wards,
  ]);

  const massImportFields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.FILE,
        fieldProps: {
          description:
            "Choose your file to import multiple employess for your shop at once, accept .csv file",
          form: massImportForm,
          name: "file",
          placeholder: "Choose a file",
          label: "Import File",
          accept: ".csv",
          width: 300,
          required: true,
        },
      },
    ];
  }, [massImportForm]);

  return (
    <>
      <Box pt={rem(20)} pl={rem(32)}>
        <CustomBreadcrumb items={breadcrumbs} goBack />
      </Box>
      <Paper m={rem(32)} p={rem(32)} shadow="xs">
        <Group pb={20} align="center" justify="space-between">
          <Group>
            <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
              New employee
            </Text>
          </Group>
          <Button onClick={openMassImport}>Import File</Button>
        </Group>

        <form
          onSubmit={createEmployeeForm.onSubmit(
            ({ name, addressLine, birthday, email, gender, phone, wardId }) => {
              const createEmployeeParams: CreateEmployeeParams = {
                email: email ?? null,
                name: name ?? "",
                gender: gender,
                addressLine,
                birthday: birthday
                  ? dayjs(birthday).format("YYYY-MM-DD")
                  : null,
                phone,
                wardId,
              };

              let sb: CreateEmployeeParams = _.omitBy(
                createEmployeeParams,
                _.isNil
              ) as CreateEmployeeParams;
              craeteEmployee(sb, {
                onSuccess() {
                  navigate(`/shop/employee`);
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
            }
          )}
        >
          <EditAndUpdateForm fields={createEmployeeFields} />
          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              disabled={!createEmployeeForm.isDirty()}
              loading={isCreateEmployeeLoading}
            >
              Create
            </Button>
          </Group>
        </form>
      </Paper>

      {/* Mass import modal section */}
      <Modal opened={openedMassImport} onClose={closeMassImport} size="lg" title="Import Multiple Employees" centered closeOnClickOutside={false}>
        <form autoComplete="off" onSubmit={massImportForm.onSubmit(({ file }) => {
          // console.log(file)
          uploadEmployee({ file }, {
            onSuccess() {
              notifications.show({
                title: "Successfully",
                message: "Import successful!",
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
          })
        })}>
          <Group align="end">
            <EditAndUpdateForm fields={massImportFields} />
            <DownloadButton type="employee" />
          </Group>
          <Group mt="md">
            <Button type="submit" loading={isUploadEmployeeLoading}>
              Import
            </Button>
            <Button
              type="submit"
              variant="outline"
              onClick={closeMassImport}
              loading={isUploadEmployeeLoading}
            >
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default CreateEmployeePage;
