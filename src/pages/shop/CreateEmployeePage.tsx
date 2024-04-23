import { Button, Group, Paper, Text, rem } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import _, { isEmpty } from "lodash";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreateEmployeeParams } from "../../apis/EmployeeAPI";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useCreateEmployee } from "../../hooks/useCreateEmployee";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { Gender } from "../../models/CamAIEnum";
import { ResponseErrorDetail } from "../../models/Response";
import { mapLookupToArray } from "../../utils/helperFunction";
import { emailRegex } from "../../types/constant";

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
  const createEmployeeForm = useForm<CreateEmployeeField>({
    initialValues: {
      name: "",
      email: "",
      gender: Gender.Male,
      phone: "",
      birthday: new Date("01/01/2000"),
      addressLine: "",
      wardId: null,
      province: "",
      district: "",
    },
    validate: {
      name: isNotEmpty("Employee name is required"),
      email: (value) => isEmpty(value) ? null
        : emailRegex.test(value) ? null : "Invalid email - ex: name@gmail.com",
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
    <Paper m={rem(32)} p={rem(32)} shadow="xs">
      <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"} pb={rem(28)}>
        Add employee
      </Text>
      <form
        onSubmit={createEmployeeForm.onSubmit(
          ({ name, addressLine, birthday, email, gender, phone, wardId }) => {
            const createEmployeeParams: CreateEmployeeParams = {
              email: email ?? null,
              name: name ?? "",
              gender: gender,
              addressLine,
              birthday: birthday ? dayjs(birthday).format("YYYY-MM-DD") : null,
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
        <EditAndUpdateForm fields={fields} />
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
  );
};

export default CreateEmployeePage;
