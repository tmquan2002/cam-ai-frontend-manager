import { Button, Group, Paper, Text, rem } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { CreateAccountParams } from "../../apis/AccountAPI";
import dayjs from "dayjs";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import { useCreateAccount } from "../../hooks/useCreateAccount";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useMemo } from "react";
import { mapLookupToArray } from "../../utils/helperFunction";
import { Gender, Role } from "../../models/CamAIEnum";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useNavigate } from "react-router-dom";

export type CreateAccountField = {
  email: string;
  password: string;
  name: string;
  gender: Gender;
  phone: string;
  birthday: Date | null;
  wardId: string;
  addressLine: string;
  province: string;
  district: string;
};

const CreateManagerPage = () => {
  const navigate = useNavigate();
  const { data: brandList, isLoading: isGetBrandListLoading } = useGetBrandList(
    { size: 1 }
  );

  const { mutate: createAccount, isLoading: isCreateAccountLoading } =
    useCreateAccount();

  const createAccountForm = useForm<CreateAccountField>({
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email - ex: huy@gmail.com",
      password: isNotEmpty("Name must not be empty"),
      gender: isNotEmpty("Please select gender"),
      phone: (value) =>
        value == "" || /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)
          ? null
          : "Invalid phone number - ex: 0379999999",
      province: isNotEmpty("Provice is required"),
      district: isNotEmpty("District is required"),
    },
  });

  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();

  const {
    data: createAccountDistricts,
    isLoading: isCreateAccountDistrictsLoading,
  } = useGetDistrictList(+(createAccountForm.values.province ?? 0));

  const { data: createAccountWards, isLoading: isCreateAccountWardsLoading } =
    useGetWardList(+(createAccountForm.values.district ?? 0));

  const addNewAccountfields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createAccountForm,
          name: "email",
          placeholder: "Email",
          label: "Email",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createAccountForm,
          name: "password",
          placeholder: "Password",
          label: "Password",
          type: "password",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createAccountForm,
          name: "name",
          placeholder: "Name",
          label: "Name",
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createAccountForm,
          name: "phone",
          placeholder: "Phone",
          label: "Phone",
          required: true,
        },
        spans: 6,
      },

      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Gender",
          placeholder: "Gender",
          data: mapLookupToArray(Gender ?? {}),
          form: createAccountForm,
          name: "gender",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form: createAccountForm,
          name: "birthday",
          placeholder: "Birthday",
          label: "Birthday",
        },
        spans: 6,
      },

      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Province",
          placeholder: "Province",
          data: provinces?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: createAccountForm,
          name: "province",
          required: true,

          loading: isProvicesLoading,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "District",
          placeholder: "District",
          data: createAccountDistricts?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: createAccountForm,
          name: "district",
          loading: isCreateAccountDistrictsLoading,
          required: true,

          // disabled: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Ward",
          placeholder: "Ward",
          data: createAccountWards?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: createAccountForm,
          name: "wardId",
          loading: isCreateAccountWardsLoading,
          required: true,
          // disabled: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createAccountForm,
          name: "addressLine",
          placeholder: "Address",
          label: "Address",
        },
      },
    ];
  }, [
    createAccountForm,
    provinces,
    isProvicesLoading,
    createAccountDistricts,
    isCreateAccountDistrictsLoading,
    createAccountWards,
    isCreateAccountWardsLoading,
  ]);
  return (
    <Paper
      m={rem(32)}
      p={rem(32)}
    >
      <Text
        size="lg"
        fw={"bold"}
        fz={25}
        c={"light-blue.4"}
        mb={rem(30)}
      >
        Create manager account
      </Text>
      <form
        onReset={createAccountForm.onReset}
        autoComplete="off"
        onSubmit={createAccountForm.onSubmit(
          ({
            addressLine,
            birthday,
            email,
            gender,
            name,
            password,
            phone,
            wardId,
          }: CreateAccountField) => {
            const params: CreateAccountParams = {
              addressLine,
              birthday: dayjs(birthday).format("YYYY-MM-DD"),
              brandId: brandList?.values[0].id ?? "",
              email,
              gender: gender ?? null,
              name,
              password,
              phone,
              role: Role.ShopManager,
              wardId: +wardId,
            };

            createAccount(params, {
              onSuccess() {
                notifications.show({
                  title: "Successfully",
                  message: "Create account successfully!",
                });
                navigate("/brand/account");
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
        <EditAndUpdateForm fields={addNewAccountfields} />
        <Group
          justify="flex-end"
          mt="md"
        >
          <Button
            type="submit"
            loading={isCreateAccountLoading || isGetBrandListLoading}
          >
            Create
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default CreateManagerPage;
