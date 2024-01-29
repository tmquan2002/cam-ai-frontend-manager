import { useForm } from "@mantine/form";
import { useEffect, useMemo } from "react";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { Button, Group, Loader, Paper, Text, rem } from "@mantine/core";
import { useGetGenderList } from "../../hooks/useGetGender";
import {
  mapLookupStringValueToArray,
  mapNumberLookupToArray,
} from "../../utils/helperFunction";
import { useGetAccountById } from "../../hooks/useGetAccountById";
import { getUserId } from "../../context/AuthContext";
import { useGetAccountStatusList } from "../../hooks/useGetAccountStatus";
import { UpdateAccountParams } from "../../apis/AccountAPI";
import { useUpdateAccount } from "../../hooks/useUpdateAccount";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";

type ProfileFieldValue = {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  gender: string;
};

const BrandManagerProfilePage = () => {
  const {
    data: gender,
    // isLoading: isGenderLoading
  } = useGetGenderList();
  const { data: account, isLoading: isAccountLoading } = useGetAccountById(
    getUserId() ?? "0"
  );
  const
    {
      data: accountStatus,
      // isLoading: isAccountStatusLoading 
    } =
      useGetAccountStatusList();
  const
    {
      mutate: updateAccount,
      // isLoading: updateAccountLoading 
    } =
      useUpdateAccount();
  const form = useForm<ProfileFieldValue>({});

  useEffect(() => {
    if (account) {
      const initialValue: ProfileFieldValue = {
        name: account?.name,
        email: account?.email,
        phone: account?.phone,
        birthday: account?.birthday,
        address: account?.addressLine,
        gender: account?.gender,
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

  if (isAccountLoading) return <Loader />;

  return (
    <Paper
      p={rem(32)}
      style={{ flex: 1 }}
    >
      <Text
        fw={500}
        size="xl"
        mb={rem(32)}
      >
        Account profile
      </Text>
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

export default BrandManagerProfilePage;
