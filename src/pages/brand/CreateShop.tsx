import { Button, Collapse, Group, Paper, Text, rem } from "@mantine/core";
import { useMemo } from "react";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { isNotEmpty, useForm } from "@mantine/form";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useGetAccountList } from "../../hooks/useGetAccounts";
import { useCreateShop } from "../../hooks/useCreateShop";
import { CreateShopParams } from "../../apis/ShopAPI";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useGetGenderList } from "../../hooks/useGetGender";
import { mapLookupStringValueToArray } from "../../utils/helperFunction";
import { useCreateAccount } from "../../hooks/useCreateAccount";
import { CreateAccountParams } from "../../apis/AccountAPI";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import dayjs from "dayjs";

export type CreateShopField = {
  name: string;
  phone: string;
  wardId: string | null;
  shopManagerId: string | null;
  addressLine: string;
  province: string | null;
  district: string | null;
};

export type CreateAccountField = {
  email: string;
  password: string;
  name: string;
  gender: number | null;
  phone: string;
  birthday: Date | null;
  wardId: number | null;
  addressLine: string;
  province: string | null;
  district: string | null;
};

const CreateShop = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const createShopForm = useForm<CreateShopField>({
    initialValues: {
      name: "",
      phone: "",
      wardId: null,
      shopManagerId: null,
      addressLine: "",
      province: null,
      district: null,
    },
    validate: {
      name: isNotEmpty("Name is required"),
      phone: (value) =>
        value == "" || /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)
          ? null
          : "Invalid phone number - ex: 0379999999",
      addressLine: isNotEmpty("Address line is required"),
      wardId: isNotEmpty("Ward is required"),
      province: isNotEmpty("Provice is required"),
      district: isNotEmpty("District is required"),
    },
  });

  const createAccountForm = useForm<CreateAccountField>({
    initialValues: {
      email: "",
      password: "",
      name: "",
      gender: null,
      phone: "",
      birthday: null,
      wardId: null,
      addressLine: "",
      district: null,
      province: null,
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email - ex: huy@gmail.com",
      password: isNotEmpty("Name must not be empty"),
      gender: isNotEmpty("Please select gender"),
      phone: (value) =>
        /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)
          ? null
          : "Invalid phone number - ex: 0379999999",
      province: isNotEmpty("Provice is required"),
      district: isNotEmpty("District is required"),
    },
  });

  const navigate = useNavigate();
  const {
    data: accountList,
    isLoading: isAccountListLoading,
    refetch: refetchAccountList,
  } = useGetAccountList();
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(createShopForm.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(createShopForm.values.district ?? 0)
  );

  const {
    data: createAccountDistricts,
    isLoading: isCreateAccountDistrictsLoading,
  } = useGetDistrictList(+(createAccountForm.values.province ?? 0));
  const { data: createAccountWards, isLoading: isCreateAccountWardsLoading } =
    useGetWardList(+(createAccountForm.values.district ?? 0));
  const { data: genderList, isLoading: isGetGenderListLoading } =
    useGetGenderList();

  const { data: brandList, isLoading: isGetBrandListLoading } = useGetBrandList(
    { size: 1 }
  );

  const { mutate: createShop, isLoading: isCreateShopLoading } =
    useCreateShop();
  const { mutate: createAccount, isLoading: isCreateAccountLoading } =
    useCreateAccount();

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createShopForm,
          name: "name",
          placeholder: "Shop name",
          label: "Shop name",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createShopForm,
          name: "phone",
          type: "number",
          placeholder: "Shop phone",
          label: "Shop phone",
        },
      },

      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          form: createShopForm,
          name: "shopManagerId",
          placeholder: "Shop manager",
          label: "Shop manager",
          data: accountList?.values?.map((item) => {
            return {
              value: item.id,
              label: item.name,
              disabled: item.managingShop != null,
            };
          }),
          loading: isAccountListLoading,
          rightSectionWidth: 70,
          rightSection: (
            <Button
              variant="subtle"
              onClick={toggle}
            >
              New
            </Button>
          ),
          // searchable: true,

          // required: true,
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
          form: createShopForm,
          name: "province",
          loading: isProvicesLoading,
          required: true,
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
          form: createShopForm,
          name: "district",
          loading: isDistrictsLoading,
          required: true,
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
          form: createShopForm,
          name: "wardId",
          loading: isWardsLoading,
          required: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createShopForm,
          name: "addressLine",
          placeholder: "Shop address",
          label: "Shop address",
          required: true,
        },
      },
    ];
  }, [
    createShopForm,
    accountList?.values,
    isAccountListLoading,
    toggle,
    provinces,
    isProvicesLoading,
    districts,
    isDistrictsLoading,
    wards,
    isWardsLoading,
  ]);

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
          data: mapLookupStringValueToArray(genderList ?? {}),
          form: createAccountForm,
          name: "gender",
          loading: isGetGenderListLoading,
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
    genderList,
    isGetGenderListLoading,
    provinces,
    isProvicesLoading,
    createAccountDistricts,
    isCreateAccountDistrictsLoading,
    createAccountWards,
    isCreateAccountWardsLoading,
  ]);

  return (
    <>
      <Paper
        m={rem(32)}
        mb={0}
        p={rem(32)}
        shadow="xl"
      >
        <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>ADD NEW SHOP</Text>
        <form
          onSubmit={createShopForm.onSubmit(
            ({ addressLine, name, phone, wardId, shopManagerId }) => {
              const updateParams: CreateShopParams = {
                addressLine,
                name,
                phone,
                wardId: +(wardId ?? 0),
                shopManagerId: shopManagerId ?? "0",
              };
              createShop(updateParams, {
                onSuccess(data) {
                  notifications.show({
                    title: "Successfully",
                    message: "Craete shop successfully!",
                  });
                  navigate(`/brand/shop/${data.id}`);
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
              loading={isCreateShopLoading}
            >
              Create
            </Button>
          </Group>
        </form>
      </Paper>
      <Collapse in={opened}>
        <Paper
          m={rem(32)}
          p={rem(32)}
        >
          <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>ADD SHOP MANAGER ACCOUNT</Text>
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
              }) => {
                const params: CreateAccountParams = {
                  addressLine,
                  birthday: dayjs(birthday).format("YYYY-MM-DD"),
                  brandId: brandList?.values[0].id ?? "",
                  email,
                  gender: gender ?? 0,
                  name,
                  password,
                  phone,
                  roleIds: [4],
                  wardId: wardId ?? 0,
                };

                createAccount(params, {
                  onSuccess() {
                    notifications.show({
                      title: "Successfully",
                      message: "Create account successfully!",
                    });
                    refetchAccountList(), toggle();
                    createAccountForm.reset();
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
      </Collapse>
    </>
  );
};

export default CreateShop;
