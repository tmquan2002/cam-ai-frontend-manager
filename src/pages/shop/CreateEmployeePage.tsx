import { Box, Button, Group, Modal, Paper, Text, rem } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
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
import { useTaskShop } from "../../routes/ShopRoute";
import { CommonConstant, EMAIL_REGEX } from "../../types/constant";
import {
  getDateFromSetYear,
  mapLookupToArray,
} from "../../utils/helperFunction";

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
  const { taskId, setTaskId } = useTaskShop();

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
      email: (value: string) => isEmpty(value) ? "Email is required"
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
          radius: "md",
          disabled: taskId !== undefined,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createEmployeeForm,
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
          form: createEmployeeForm,
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
          form: createEmployeeForm,
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
          form: createEmployeeForm,
          name: "birthday",
          placeholder: "Birthday",
          label: "Birthday",
          maxDate: getDateFromSetYear(18),
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
          form: createEmployeeForm,
          name: "province",
          radius: "md",
          disabled: taskId !== undefined,
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
          form: createEmployeeForm,
          name: "wardId",
          loading: isWardsLoading,
          radius: "md",
          disabled: taskId !== undefined,
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
          radius: "md",
          disabled: taskId !== undefined,
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
          label: "Import Employees",
          accept: ".csv",
          width: 300,
          required: true,
          disabled: taskId !== undefined,
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
          <Button onClick={openMassImport} disabled={taskId !== undefined}>Import File</Button>
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
              disabled={!createEmployeeForm.isDirty() || taskId !== undefined}
              loading={isCreateEmployeeLoading}
            >
              Create
            </Button>
          </Group>
        </form>
      </Paper>

      {/* Mass import modal section */}
      <Modal
        opened={openedMassImport}
        onClose={closeMassImport}
        size="lg"
        title="Import Multiple Employees"
        centered
        closeOnClickOutside={false}
      >
        <form
          autoComplete="off"
          onSubmit={massImportForm.onSubmit(({ file }) => {
            // console.log(file)
            notifications.show({
              id: "uploadEmployeeProgress",
              title: "Notice",
              color: "light-blue.4",
              message: "Import in progress",
              autoClose: false,
              withCloseButton: false,
              icon: (
                <IconCheck style={{ width: rem(18), height: rem(18) }} />
              ),
              loading: true,
            });
            uploadEmployee(
              { file }, {
              onSuccess(data) {
                closeMassImport();
                massImportForm.reset();
                // console.log(data.taskId)

                setTaskId(data.taskId);
                localStorage.setItem(CommonConstant.TASK_ID, data?.taskId)
                notifications.show({
                  id: "uploadEmployeeProgress",
                  title: "Notice",
                  color: "light-blue.4",
                  message: "Import in progress",
                  autoClose: false,
                  withCloseButton: false,
                  icon: (
                    <IconCheck style={{ width: rem(18), height: rem(18) }} />
                  ),
                  loading: true,
                });
              },
              onError(data) {
                const error = data as AxiosError<ResponseErrorDetail>;
                notifications.show({
                  id: "uploadEmployeeProgress",
                  color: "red",
                  title: "Failed",
                  message:
                    error.response?.data?.message ||
                    "Something wrong happen trying to upload the file",
                  autoClose: 5000,
                  icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                  loading: false,
                });
              },
            }
            );
          })}
        >
          <Group align="end">
            <EditAndUpdateForm fields={massImportFields} />
            <DownloadButton type="employee" />
          </Group>
          <Group mt="md">
            <Button type="submit" loading={isUploadEmployeeLoading} disabled={taskId !== undefined}>
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
