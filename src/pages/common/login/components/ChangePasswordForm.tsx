import { TextInput, Button, Group, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MdLockOutline } from "react-icons/md";
import { AuthToken } from "../../../../models/Auth";
import { useChangePassword } from "../../../../hooks/useChangePassword";
import { ChangePasswordParams } from "../../../../apis/LoginAPI";
import { useSession } from "../../../../context/AuthContext";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../../../models/Response";
import { notifications, useNotifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

export const ChangePasswordForm = (data: AuthToken) => {
  const sessionHook = useSession();
  const { mutate: changePassword, isLoading } = useChangePassword();

  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validate: {
      oldPassword: (value) =>
        value.trim().length === 0 ? "This field is required" : null,
      newPassword: (value) =>
        value.trim().length === 0 ? "This field is required" : null,
      confirmPassword: (value) =>
        value.trim().length === 0 ? "This field is required" : null,
    },
  });

  const onSubmitForm = ({
    confirmPassword,
    newPassword,
    oldPassword,
  }: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const params: ChangePasswordParams = {
      accessToken: data.accessToken,
      oldPassword,
      newPassword,
      newPasswordRetype: confirmPassword,
    };
    changePassword(params, {
      onSuccess() {
        sessionHook?.signIn(data);
      },
      onError(error) {
        const data = error as AxiosError<ResponseErrorDetail>;
        notifications.show({
          color: "red",
          icon: <IconX />,
          title: "Change password failed",
          message: data.response?.data?.message,
        });
      },
    });
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => onSubmitForm(values))}
      style={{ marginTop: rem(12) }}
    >
      <TextInput
        withAsterisk
        label="Old Password"
        type="password"
        leftSection={<MdLockOutline />}
        size="md"
        {...form.getInputProps("oldPassword")}
      />

      <TextInput
        withAsterisk
        label="New Password"
        type="password"
        leftSection={<MdLockOutline />}
        size="md"
        {...form.getInputProps("newPassword")}
      />

      <TextInput
        withAsterisk
        label="Confirm New Password"
        type="password"
        leftSection={<MdLockOutline />}
        size="md"
        {...form.getInputProps("confirmPassword")}
      />

      <Group
        justify="flex-start"
        mt="md"
      >
        <Button
          type="submit"
          variant="gradient"
          size="md"
          gradient={{ from: "blue", to: "cyan", deg: 90 }}
        >
          Change Password
        </Button>
      </Group>
    </form>
  );
};
