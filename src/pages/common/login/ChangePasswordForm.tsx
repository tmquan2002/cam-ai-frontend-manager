import { Button, Group, TextInput, rem } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { MdLockOutline } from "react-icons/md";
import { ChangePasswordParams } from "../../../apis/ProfileAPI";
import { useSession } from "../../../context/AuthContext";
import { useChangePassword } from "../../../hooks/useChangePassword";
import { AuthToken } from "../../../models/Auth";
import { ResponseErrorDetail } from "../../../models/Response";

export const ChangePasswordForm = (data: AuthToken) => {
  const sessionHook = useSession();
  const { mutate: changePassword } = useChangePassword();

  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validate: {
      oldPassword: isNotEmpty("Old Password is required"),
      newPassword: isNotEmpty("New Password is required"),
      confirmPassword: isNotEmpty("Confirm Password is required"),
    },
  });

  const onSubmitForm = ({ confirmPassword, newPassword, oldPassword, }: { oldPassword: string; newPassword: string; confirmPassword: string; }) => {
    const params: ChangePasswordParams = {
      accessToken: data.accessToken,
      oldPassword,
      newPassword,
      newPasswordRetype: confirmPassword,
    };

    if (newPassword !== confirmPassword) {
      notifications.show({
        color: "red",
        title: "Failed",
        message: "New Passwords are not matched",
      });
      return;
    }

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
          mt={20}
          gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
        >
          Change Password
        </Button>
      </Group>
    </form>
  );
};
