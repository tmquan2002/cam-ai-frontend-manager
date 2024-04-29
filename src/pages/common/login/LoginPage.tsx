import styled from "./login.module.scss";
import AuthImage from "../../../assets/images/login_signup_main.png";
import { Box, Button, Group, Modal, Text, TextInput, rem } from "@mantine/core";
import { useState } from "react";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { useLogin } from "../../../hooks/useLogin";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { LoginParams } from "../../../apis/LoginAPI";
import { getStatusFromToken } from "../../../utils/jwt";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { AuthToken } from "../../../models/Auth";
import { useSession } from "../../../context/AuthContext";
import LightDarkSwitch from "../../../components/lightdarkswitch/LightDarkSwitch";
import { AccountStatus } from "../../../models/CamAIEnum";
import axios from "axios";
import { notifications } from "@mantine/notifications";

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
      email: isEmail("Invalid email - ex: name@gmail.com"),
      password: isNotEmpty("Password is required"),
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
          getStatusFromToken(data.accessToken) != AccountStatus.New;

        if (!didUserChangePassword) {
          setAuthTokens(data);
          setModalOpen(true);
        } else {
          sessionHook?.signIn(data);
        }
      },
      onError(error) {
        if (axios.isAxiosError(error)) {
          // console.error(error.response?.data as ApiErrorResponse);
          notifications.show({
            message: error.response?.data.message,
            color: "pale-red.5",
            withCloseButton: true,
          });
        } else {
          // console.error(error);
          notifications.show({
            message: "Something wrong happen trying to login",
            color: "pale-red.5",
            withCloseButton: true,
          });
        }
      },
    });
  };

  return (
    <>
      <div className={styled["container-main"]}>
        <div className={styled["image-container"]}>
          <Box className={styled["title"]} mb={rem(10)}>
            CAMAI - MANAGER
          </Box>
          <Text className={styled["description"]}>
            Solution for coffee brands to detect customers and employee
            behaviors
          </Text>
          <img
            src={AuthImage}
            alt="AuthImage"
            className={styled["auth-image"]}
          />
        </div>
        <div className={styled["container"]}>
          <div className={styled["title"]}>
            <div>LOGIN</div>
            <LightDarkSwitch size="lg" />
          </div>
          <form
            onSubmit={form.onSubmit((values) => onSubmitForm(values))}
            style={{ textAlign: "left" }}
          >
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              mt={10}
              leftSection={<MdEmail />}
              size="md"
              {...form.getInputProps("email")}
            />

            <TextInput
              withAsterisk
              label="Password"
              type="password"
              placeholder="Password"
              mt={20}
              leftSection={<MdLockOutline />}
              size="md"
              {...form.getInputProps("password")}
            />

            <Group justify="flex-start" mt="md">
              <Button
                type="submit"
                variant="gradient"
                size="md"
                loading={isLoading}
                mt={20}
                gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
              >
                Login
              </Button>
            </Group>
          </form>

          <Modal
            opened={modalOpen}
            onClose={() => setModalOpen(false)}
            centered
            title="New User"
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
