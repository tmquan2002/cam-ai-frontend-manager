import { Box, Button, Group, Modal, Text, TextInput, rem } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { isEmpty } from "lodash";
import { useState } from "react";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { LoginParams } from "../../../apis/LoginAPI";
import AuthImage from "../../../assets/images/login_signup_main.png";
import LightDarkSwitch from "../../../components/lightdarkswitch/LightDarkSwitch";
import { useSession } from "../../../context/AuthContext";
import { useLogin } from "../../../hooks/useLogin";
import { AuthToken } from "../../../models/Auth";
import { AccountStatus } from "../../../models/CamAIEnum";
import { getStatusFromToken } from "../../../utils/jwt";
import { ChangePasswordForm } from "./ChangePasswordForm";
import styled from "./login.module.scss";

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
      email: (value: string) => isEmpty(value) ? "Email is required"
        : /^\S+@(\S+\.)+\S{2,4}$/g.test(value) ? null : "Invalid email - ex: name@gmail.com",
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
              mt={20}
              leftSection={<MdEmail />}
              styles={{
                label: {
                  marginBottom: rem(4),
                },
              }}
              radius={rem(8)}
              size="md"
              {...form.getInputProps("email")}
            />

            <TextInput
              withAsterisk
              label="Password"
              type="password"
              placeholder="Password"
              mt={16}
              radius={rem(8)}
              styles={{
                label: {
                  marginBottom: rem(4),
                },
              }}
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
                mt={12}
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
