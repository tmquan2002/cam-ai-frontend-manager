import styled from "./styles/login.module.scss";
import AuthImage from "../../../assets/images/login_signup_main.png"
import { LoginForm } from "./components/LoginForm";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { ChangePasswordForm } from "./components/ChangePasswordForm";

const LoginPage = () => {

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className={styled["container-main"]}>
        <div className={styled["image-container"]}>
          <div className={styled["title"]}>CAMAI</div>
          <div className={styled["description"]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
          <img src={AuthImage} alt="AuthImage" className={styled["auth-image"]} />
        </div>
        <div className={styled["container"]}>
          <div className={styled["title"]}>
            LOGIN
          </div>
          <LoginForm setModalOpen={setModalOpen} modalOpen={modalOpen} />
          <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="New User" centered>
            <div>Please change given password with your new password to continue</div>
            <ChangePasswordForm />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
