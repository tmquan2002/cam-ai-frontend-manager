import { Button, Group, Paper, Text, rem } from "@mantine/core";
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

export type CreateShopField = {
  name: string;
  phone: string;
  wardId: string;
  brandId: string;
  shopManagerId: string;
  addressLine: string;
  province: string;
  district: string;
};

const CreateShop = () => {
  const form = useForm<CreateShopField>({
    initialValues: {
      name: "",
      phone: "",
      wardId: "",
      brandId: "",
      shopManagerId: "",
      addressLine: "",
      province: "",
      district: "",
    },
    validate: {
      name: isNotEmpty("Name is required"),
      phone: (value) =>
        /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)
          ? null
          : "Invalid phone number",
      addressLine: isNotEmpty("Address line is required"),
      wardId: isNotEmpty("Ward is required"),
    },
  });

  const navigate = useNavigate();
  const { data: accountList, isLoading: isAccountListLoading } =
    useGetAccountList();
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +form.values.province
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +form.values.district
  );

  const { mutate: createShop, isLoading: isCreateShopLoading } =
    useCreateShop();

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "name",
          placeholder: "Shop name",
          label: "Shop name",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "phone",
          type: "number",
          placeholder: "Shop phone",
          label: "Shop phone",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "addressLine",
          placeholder: "Shop address",
          label: "Shop address",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          form,
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
          searchable: true,
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
          form,
          searchable: true,
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
          form,
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
          form,
          name: "wardId",
          loading: isWardsLoading,
          required: true,
        },
        spans: 4,
      },
    ];
  }, [
    districts,
    form,
    isDistrictsLoading,
    isProvicesLoading,
    isWardsLoading,
    provinces,
    wards,
    accountList,
    isAccountListLoading,
  ]);

  return (
    <Paper
      m={rem(32)}
      p={rem(32)}
    >
      <Text
        fw={500}
        size="lg"
        pb={rem(28)}
      >
        Add new shop
      </Text>
      <form
        onSubmit={form.onSubmit(
          ({ addressLine, brandId, name, phone, wardId, shopManagerId }) => {
            const updateParams: CreateShopParams = {
              addressLine,
              brandId,
              name,
              phone,
              wardId: +wardId,
              shopManagerId,
            };
            createShop(updateParams, {
              onSuccess(data) {
                notifications.show({
                  title: "Successfully",
                  message: "Update account success!",
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
            Submit
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default CreateShop;
