import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Text,
  rem,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { ResponseErrorDetail } from "../../models/Response";
import { useGetProfile } from "../../hooks/useGetProfile";
import { IconKey } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useChangePassword } from "../../hooks/useChangePassword";
import {
  ChangePasswordParams,
  UpdateProfileParams,
} from "../../apis/ProfileAPI";
import { mapLookupToArray } from "../../utils/helperFunction";
import { Gender } from "../../models/CamAIEnum";
import { getAccessToken } from "../../context/AuthContext";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { PHONE_REGEX } from "../../types/constant";

type ProfileFieldValue = {
  name: string;
  email: string;
  phone: string;
  birthday?: Date;
  address: string;
  gender: Gender;
  wardId: string;
  province: string;
  district: string;
};

type ChangePasswordFieldValue = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const BrandManagerProfilePage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { data: account, isLoading: isAccountLoading } = useGetProfile();
  const { mutate: changePassword, isLoading: isChangingPassword } =
    useChangePassword();
  const form = useForm<ProfileFieldValue>({
    validate: {
      name: isNotEmpty("Name is required"),
      email: isEmail("Invalid email - ex: name@gmail.com"),
      gender: isNotEmpty("Please select gender"),
      phone: (value) => isEmpty(value) ? null :
        PHONE_REGEX.test(value) ? null : "A phone number should have a length of 10-12 characters",
    },
  });

  const { mutate: updateProfile, isLoading: updateProfileLoading } =
    useUpdateProfile();

  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(form.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(form.values.district ?? 0)
  );
  const passwordForm = useForm<ChangePasswordFieldValue>({
    initialValues: {
      confirmPassword: "",
      newPassword: "",
      oldPassword: "",
    },
    validate: {
      oldPassword: isNotEmpty("Old password is required!"),
      newPassword: isNotEmpty("New password is required!"),
      confirmPassword: (value, values) => {
        if (value === "") return "Please confirm password!";
        if (value !== values.newPassword)
          return "New password are not the same!";
      },
    },
  });
  const onSubmitNewPassword = ({
    confirmPassword,
    newPassword,
    oldPassword,
  }: ChangePasswordFieldValue) => {
    const params: ChangePasswordParams = {
      accessToken: getAccessToken() ?? "",
      oldPassword,
      newPassword,
      newPasswordRetype: confirmPassword,
    };
    changePassword(params, {
      onSuccess() {
        notifications.show({
          title: "Successfully",
          message: "Change password successfully!",
        });
        close();
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
  };

  useEffect(() => {
    if (account) {
      form.setInitialValues({
        name: account?.name,
        email: account?.email,
        phone: account?.phone,
        birthday: account?.birthday ? new Date(account?.birthday) : undefined,
        address: account?.addressLine,
        gender: account?.gender,
        district: account?.ward?.districtId?.toString(),
        province: account?.ward?.district?.provinceId?.toString(),
        wardId: account?.wardId?.toString(),
      });
      form.reset();
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
          readonly: true,
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
          required: true,
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
          name: "address",
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

  const changePasswordFields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: passwordForm,
          type: "password",
          name: "oldPassword",
          placeholder: "Old password ",
          label: "Old password",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: passwordForm,
          type: "password",

          name: "newPassword",
          placeholder: "New password ",
          label: "New password",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: passwordForm,
          type: "password",

          name: "confirmPassword",
          placeholder: "Confirm password ",
          label: "Confirm password",
          required: true,
        },
      },
    ];
  }, [passwordForm]);

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
    <>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          passwordForm.reset();
        }}
        title="Change password"
        centered
      >
        <form onSubmit={passwordForm.onSubmit(onSubmitNewPassword)}>
          <EditAndUpdateForm fields={changePasswordFields} />
          <Group
            justify="flex-end"
            mt="md"
          >
            <Button
              type="submit"
              loading={isChangingPassword}
            >
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
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
            Your profile
          </Text>

          <ActionIcon
            onClick={open}
            size={"lg"}
          >
            <IconKey style={{ width: rem(20), height: rem(20) }} />
          </ActionIcon>
        </Group>
        <form
          onSubmit={form.onSubmit((values) => {
            const params: UpdateProfileParams = {
              addressLine: values.address,
              birthday: values?.birthday
                ? dayjs(values.birthday).format("YYYY-MM-DD")
                : null,
              gender: values.gender,
              phone: values.phone,
              wardId: +values?.wardId,
              email: values?.email,
            };
            updateProfile(params, {
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
              disabled={!form.isDirty()}
              loading={updateProfileLoading}
              type="submit"
              mt={10}
            >
              Submit
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  );
};

export default BrandManagerProfilePage;
