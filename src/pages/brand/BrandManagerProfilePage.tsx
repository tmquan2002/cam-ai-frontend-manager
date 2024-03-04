import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Paper,
  Text,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { UpdateAccountParams } from "../../apis/AccountAPI";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useUpdateAccount } from "../../hooks/useUpdateAccount";
import { ResponseErrorDetail } from "../../models/Response";
import { useGetProfile } from "../../hooks/useGetProfile";
import { IconAdjustments, IconArrowsLeftRight } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useChangePassword } from "../../hooks/useChangePassword";
import { ChangePasswordParams } from "../../apis/ProfileAPI";
import { mapLookupToArray } from "../../utils/helperFunction";
import { Gender } from "../../models/CamAIEnum";
import { getAccessToken, getUserId } from "../../context/AuthContext";

type ProfileFieldValue = {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  gender: Gender;
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

  const { mutate: updateAccount, isLoading: updateAccountLoading } =
    useUpdateAccount();
  const form = useForm<ProfileFieldValue>({});
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
          data: mapLookupToArray(Gender ?? {}),
          form,
          name: "gender",
        },
        spans: 6,
      },
    ];
  }, [form]);

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
            ACCOUNT PROFILE
          </Text>
          <Menu shadow="md">
            <Menu.Target>
              <ActionIcon
                variant="filled"
                aria-label="Settings"
              >
                <IconAdjustments
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Modify</Menu.Label>
              <Menu.Item
                onClick={open}
                leftSection={
                  <IconArrowsLeftRight
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
              >
                New password
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <form
          onSubmit={form.onSubmit((values) => {
            const params: UpdateAccountParams = {
              addressLine: values.address,
              birthday: values.birthday,
              gender: values.gender,
              name: values.name,
              phone: values.phone,
              wardId: 1,
              userId: getUserId() ?? "",
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
            pb={rem(10)}
          >
            <Button
              loading={updateAccountLoading}
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
