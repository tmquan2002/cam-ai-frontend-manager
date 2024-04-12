import { Button, Collapse, Group, Paper, Text, rem } from "@mantine/core";
import { useMemo } from "react";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
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
import { useCreateAccount } from "../../hooks/useCreateAccount";
import { CreateAccountParams } from "../../apis/AccountAPI";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import dayjs from "dayjs";
import { mapLookupToArray } from "../../utils/helperFunction";
import { Gender, Role } from "../../models/CamAIEnum";
import BackButton from "../../components/button/BackButton";

export type CreateShopField = {
  name: string;
  phone: string;
  wardId: string;
  shopManagerId: string | null;
  addressLine: string;
  province: string;
  district: string;
  openTime: string;
  closeTime: string;
};

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

const CreateShop = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const createShopForm = useForm<CreateShopField>({
    
    validate: {
      name: hasLength({ min: 1, max: 50 }, "Name is 1-50 characters long"),
      phone: (value) =>
        value == "" ||
        value == null ||
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(value)
          ? null
          : "A Phone number should have a length of 10-12 characters",
      addressLine: isNotEmpty("Address line is required"),
      wardId: isNotEmpty("Ward is required"),
      province: isNotEmpty("Province is required"),
      district: isNotEmpty("District is required"),
      openTime: isNotEmpty("Open time is required"),
      closeTime: isNotEmpty("CLose time is required"),
    },
  });

  const createAccountForm = useForm<CreateAccountField>({
    validate: {
      name: isNotEmpty("Name is required"),
      email: (value) =>
        /^\S+@(\S+\.)+\S{2,4}$/g.test(value) ? null : "An email should have a name, @ sign, a server name and domain in order and no whitespace. Valid example abc@email.com",
      password: isNotEmpty("Password must not be empty"),
      gender: isNotEmpty("Please select gender"),
      phone: (value) =>
        value == "" ||
        value == null ||
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(value)
          ? null
          : "A Phone number should have a length of 10-12 characters",
      province: isNotEmpty("Provice is required"),
      district: isNotEmpty("District is required"),
      wardId: isNotEmpty("Ward is required"),
    },
  });

  const navigate = useNavigate();
  const {
    data: accountList,
    isLoading: isAccountListLoading,
    refetch: refetchAccountList,
  } = useGetAccountList({});
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
        type: FIELD_TYPES.TIME,
        fieldProps: {
          form: createShopForm,
          
          name: "openTime",
          placeholder: "Open Time",
          label: "Open time",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TIME,
        fieldProps: {
          form: createShopForm,
          name: "closeTime",
          placeholder: "Close Time",
          label: "Close time",
          required: true,
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
          required: true,
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
    <>
      <Paper
        m={rem(32)}
        mb={0}
        p={rem(32)}
        shadow="xl"
      >
        <Group
          pb={20}
          align="center"
        >
          <BackButton />
          <Text
            size="lg"
            fw={"bold"}
            fz={25}
            c={"light-blue.4"}
          >
            Create shop
          </Text>
        </Group>
        <form
          onSubmit={createShopForm.onSubmit(
            ({ addressLine, name, phone, wardId, shopManagerId }) => {
              const updateParams: CreateShopParams = {
                addressLine,
                name,
                phone: phone == "" ? null : phone,
                wardId: +(wardId ?? 0),
                shopManagerId: shopManagerId ?? null,
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
              disabled={!createShopForm.isDirty()}
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
          <Text
            size="lg"
            fw={"bold"}
            fz={25}
            c={"light-blue.4"}
          >
            Add shop manager account
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
              }) => {
                const params: CreateAccountParams = {
                  addressLine,
                  birthday: dayjs(birthday).format("YYYY-MM-DD"),
                  brandId: brandList?.values[0].id ?? "",
                  email,
                  gender,
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
                disabled={!createAccountForm.isDirty()}
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
