import { TextInput, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { useLogin } from "../../../../hooks/useLogin";
import { LoginParams } from "../../../../apis/LoginAPI";
import { getStatusFromToken } from "../../../../utils/jwt";
import { StatusEnum } from "../../../../types/enum";

interface LoginFormProp {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginForm = (props: LoginFormProp) => {
  const { mutate: login, isLoading } = useLogin();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) =>
        value.trim().length === 0
          ? "Email is required"
          : /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value)
          ? null
          : "Invalid email",
      password: (value) =>
        value.trim().length === 0 ? "Password is required" : null,
    },
  });

  const onSubmitForm = async (values: { email: string; password: string }) => {
    const loginParams: LoginParams = {
      username: values.email,
      password: values.password,
    };

    login(loginParams, {
      onSuccess(data) {
        const didUserChangePassword: boolean =
          getStatusFromToken(data.accessToken).Id != StatusEnum.New;

        if (!didUserChangePassword) {
          props.setModalOpen(true);
        }

        // sessionHook?.signIn(data);
        // sessionHook?.signIn({
        //   ...data,
        // });
      },
      onError(error) {
        console.log(error);
      },
    });
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => onSubmitForm(values))}
      style={{ textAlign: "left" }}
    >
      <TextInput
        withAsterisk
        label="Email"
        placeholder="your@email.com"
        leftSection={<MdEmail />}
        size="md"
        {...form.getInputProps("email")}
      />

      <TextInput
        withAsterisk
        label="Password"
        type="password"
        leftSection={<MdLockOutline />}
        size="md"
        {...form.getInputProps("password")}
      />

      <Group
        justify="flex-start"
        mt="md"
      >
        <Button
          type="submit"
          // variant="gradient"
          size="md"
          loading={isLoading}
          // gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
        >
          Login
        </Button>
      </Group>
    </form>
  );
};
