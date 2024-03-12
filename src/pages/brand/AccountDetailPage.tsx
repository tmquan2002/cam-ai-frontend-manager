import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Text,
  rem,
} from "@mantine/core";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useEffect, useMemo } from "react";
import { mapLookupToArray } from "../../utils/helperFunction";
import { Gender } from "../../models/CamAIEnum";
import { isNotEmpty, useForm } from "@mantine/form";
import { useGetAccountById } from "../../hooks/useGetAccountById";
import { useParams } from "react-router-dom";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useUpdateAccount } from "../../hooks/useUpdateAccount";
import { UpdateAccountParams } from "../../apis/AccountAPI";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import dayjs from "dayjs";

type ProfileFieldValue = {
  name: string;
  email: string;
  phone: string;
  birthday: Date;
  addressLine: string;
  gender: Gender;
  wardId: string;
  province: string;
  district: string;
};

const AccountDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const form = useForm<ProfileFieldValue>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      birthday: new Date("01/01/2000"),
      gender: Gender.Male,
      addressLine: "",
      district: "",
      province: "",
      wardId: "",
    },
    validate: {
      name: isNotEmpty("Name is required"),
      email: (value) =>
        /^\S+@(\S+\.)+\S{2,4}$/g.test(value) ? null : "Invalid email - ex: huy@gmail.com",
      gender: isNotEmpty("Please select gender"),
      phone: (value) =>
        value == "" ||
          value == null ||
          /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)
          ? null
          : "Invalid phone number - ex: 0379,999,999",
    },
  });
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(form.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(form.values.district ?? 0)
  );
  const { data: accountData, isLoading: isAccountDataLoading } =
    useGetAccountById(id ?? "");

  const { mutate: updateAccount, isLoading: isUpdateAccountLoading } =
    useUpdateAccount();

  useEffect(() => {
    if (accountData) {
      form.setValues({
        addressLine: accountData?.addressLine,
        birthday: accountData.birthday
          ? new Date(accountData.birthday)
          : undefined,
        district: accountData?.ward?.districtId?.toString(),
        email: accountData?.email,
        gender: accountData?.gender,
        name: accountData?.name,
        phone: accountData?.phone,
        province: accountData?.ward?.district?.provinceId?.toString(),
        wardId: accountData?.wardId?.toString(),
      });
    }
  }, [accountData]);

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
          readonly: true,
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
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form,
          name: "birthday",
          placeholder: "Birthday",
          label: "Birthday",
        },
        spans: 6,
      },

      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Gender",
          placeholder: "Gender",
          data: mapLookupToArray(Gender ?? {}),
          form,
          name: "gender",
        },
        spans: 12,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Province",
          placeholder: "Province",
          data: provinces?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: form,
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
          form: form,
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
          form: form,
          name: "wardId",
          loading: isWardsLoading,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "addressLine",
          placeholder: "Address",
          label: "Address",
        },
        spans: 12,
      },
    ];
  }, [
    form,
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
      style={{ flex: 1 }}
      shadow="xs"
    >
      <Group
        mb={rem(20)}
        justify="space-between"
      >
        <Text
          size="lg"
          fw={"bold"}
          fz={25}
          c={"light-blue.4"}
        >
          Manager profile - {accountData?.name}
        </Text>
      </Group>
      <Box pos={"relative"}>
        {isAccountDataLoading ? (
          <LoadingOverlay
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        ) : (
          <form
            onSubmit={form.onSubmit((values) => {
              const params: UpdateAccountParams = {
                addressLine: values.addressLine,
                birthday: values.birthday
                  ? dayjs(values.birthday).format("YYYY-MM-DD")
                  : null,
                gender: values.gender,
                name: values.name,
                phone: values.phone,
                wardId: +values?.wardId,
                userId: id ?? "",
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
            })}
          >
            <EditAndUpdateForm fields={fields} />
            <Group
              justify="flex-end"
              mt="md"
              pb={rem(10)}
            >
              <Button
                loading={isUpdateAccountLoading}
                type="submit"
                mt={10}
              >
                Submit
              </Button>
            </Group>
          </form>
        )}
      </Box>
    </Paper>
  );
};

export default AccountDetailPage;
