import { Button, Group, LoadingOverlay, Paper, Text, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { UpdateAccountParams } from "../../apis/AccountAPI";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { getUserId } from "../../context/AuthContext";
import { useGetAccountById } from "../../hooks/useGetAccountById";
import { useGetAccountStatusList } from "../../hooks/useGetAccountStatus";
import { useGetGenderList } from "../../hooks/useGetGender";
import { useUpdateAccount } from "../../hooks/useUpdateAccount";
import { ResponseErrorDetail } from "../../models/Response";
import {
  mapLookupStringValueToArray,
  mapNumberLookupToArray,
} from "../../utils/helperFunction";

type ProfileFieldValue = {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  status: string;
  gender: string;
  shop: string;
};

const ShopManagerProfilePage = () => {
  const {
    data: gender,
    // isLoading: isGenderLoading
  } = useGetGenderList();
  const { data: account, isLoading: isAccountLoading } = useGetAccountById(
    getUserId() ?? "0"
  );
  const {
    data: accountStatus,
    // isLoading: isAccountStatusLoading
  } = useGetAccountStatusList();
  const {
    mutate: updateAccount,
    // isLoading: updateAccountLoading
  } = useUpdateAccount();
  const form = useForm<ProfileFieldValue>({});

  useEffect(() => {
    if (account) {
      const initialValue: ProfileFieldValue = {
        name: account?.name,
        email: account?.email,
        phone: account?.phone,
        birthday: account?.birthday,
        address: account?.addressLine,
        status: account?.accountStatus.id.toString(),
        gender: account?.gender,
        shop: account?.managingShop?.name,
      };
      form.setValues(initialValue);
    }
  }, [account]);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "name",
          placeholder: "User name",
          label: "User name",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
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
          form,
          name: "phone",
          placeholder: "Phone",
          label: "Phone",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "birthday",
          placeholder: "Birthday",
          label: "Birthday",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "address",
          placeholder: "Address",
          label: "Address",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "shop",
          placeholder: "Shop",
          label: "Shop",
          disabled: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Status",
          placeholder: "Status",
          data: mapNumberLookupToArray(accountStatus ?? {}),
          form,
          name: "status",
          disabled: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Gender",
          placeholder: "Gender",
          data: mapLookupStringValueToArray(gender ?? {}),
          form,
          name: "gender",
        },
        spans: 6,
      },
    ];
  }, [gender, form, accountStatus]);

  if (isAccountLoading)
    return (
      <Paper
        style={{ flex: 1, height: "100vh" }}
        pos={"relative"}
      >
        <LoadingOverlay
          visible={isAccountLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 1 }}
        />
      </Paper>
    );

  return (
    <Paper
      m={rem(32)}
      p={rem(32)}
      style={{ flex: 1 }}
    >
      <Group
        align="center"
        mb={rem(20)}
      >
        <Text
          size="lg"
          fw={"bold"}
          fz={22}
          c={"light-blue.4"}
        >
          ACCOUNT PROFILE
        </Text>
      </Group>

      <form
        onSubmit={form.onSubmit((values) => {
          const params: UpdateAccountParams = {
            addressLine: values.address,
            birthday: values.birthday,
            email: values.email,
            gender: values.gender,
            name: values.name,
            phone: values.phone,
            wardId: 1,
          };
          updateAccount(params, {
            onSuccess() {
              notifications.show({
                title: "Successfully",
                message: "Update account success!",
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
          });

          console.log(values);
        })}
      >
        <EditAndUpdateForm fields={fields} />
        <Group
          justify="flex-end"
          mt="md"
        >
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Paper>
  );
};

export default ShopManagerProfilePage;
