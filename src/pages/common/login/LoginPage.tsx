import styled from "./styles/login.module.scss";
import AuthImage from "../../../assets/images/login_signup_main.png";
import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { useLogin } from "../../../hooks/useLogin";
import { useForm } from "@mantine/form";
import { LoginParams } from "../../../apis/LoginAPI";
import { getStatusFromToken } from "../../../utils/jwt";
import { StatusEnum } from "../../../types/enum";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { AuthToken } from "../../../models/Auth";
import { useSession } from "../../../context/AuthContext";

const LoginPage = () => {
  const { mutate: login, isLoading } = useLogin();
  const sessionHook = useSession();
  const [authTokens, setAuthTokens] = useState<AuthToken | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
          setAuthTokens(data);
          setModalOpen(true);
        } else {
          sessionHook?.signIn(data);
        }
      },
      onError(error) {
        console.log(error);
      },
    });
  };

  return (
    <>
      <div className={styled["container-main"]}>
        <div className={styled["image-container"]}>
          <div className={styled["title"]}>CAMAI</div>
          <div className={styled["description"]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
          <img
            src={AuthImage}
            alt="AuthImage"
            className={styled["auth-image"]}
          />
        </div>
        <div className={styled["container"]}>
          <div className={styled["title"]}>LOGIN</div>
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
                variant="gradient"
                size="md"
                loading={isLoading}
                gradient={{ from: "blue", to: "cyan", deg: 90 }}
              >
                Login
              </Button>
            </Group>
          </form>

          <Modal
            opened={modalOpen}
            onClose={() => setModalOpen(false)}
            centered
          >
            <div>
              Please change given password with your new password to continue
            </div>
            <ChangePasswordForm
              accessToken={authTokens?.accessToken ?? ""}
              refreshToken={authTokens?.refreshToken ?? ""}
            />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
