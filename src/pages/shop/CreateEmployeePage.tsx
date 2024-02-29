import { Button, Group, Paper, Text, rem } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useMemo } from "react";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useCreateEmployee } from "../../hooks/useCreateEmployee";
import { CreateEmployeeParams } from "../../apis/EmployeeAPI";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import { notifications } from "@mantine/notifications";
import { mapLookupToArray } from "../../utils/helperFunction";
import { Gender } from "../../models/CamAIEnum";

export type CreateEmployeeField = {
  name: string | null;
  email: string | null;
  gender: number | null;
  phone: string | null;
  birthday: string | null;
  addressLine: string | null;
  wardId: number | null;
  province: string | null;
  district: string | null;
};
const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const createEmployeeForm = useForm<CreateEmployeeField>({
    initialValues: {
      name: null,
      email: null,
      gender: null,
      phone: null,
      birthday: null,
      addressLine: null,
      wardId: null,
      province: null,
      district: null,
    },
    validate: {
      name: isNotEmpty("Employee name is required"),
      email: isEmail("Invalid email - ex: helloitsme@gmail.com"),
      gender: isNotEmpty("Please select gender"),
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

  const fields = useMemo(() => {
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
          required: true,
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
  return (
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
        pb={rem(28)}
      >
        Add employee
      </Text>
      <form
        onSubmit={createEmployeeForm.onSubmit(
          ({ name, addressLine, birthday, email, gender, phone, wardId }) => {
            const createEmployeeParams: CreateEmployeeParams = {
              email: email ?? "",
              name: name ?? "",
              gender: gender ?? 0,
              addressLine,
              birthday,
              phone,
              wardId,
            };
            craeteEmployee(createEmployeeParams, {
              onSuccess(data) {
                navigate(`/shop/employee/${data.id}`);
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
        <EditAndUpdateForm fields={fields} />
        <Group
          justify="flex-end"
          mt="md"
        >
          <Button
            type="submit"
            loading={isCreateEmployeeLoading}
          >
            Create
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default CreateEmployeePage;
