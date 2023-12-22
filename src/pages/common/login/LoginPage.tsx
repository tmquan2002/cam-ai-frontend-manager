import styled from "./styles/login.module.scss";
import AuthImage from "../../../assets/images/login_signup_main.png"
import { LoginForm } from "./components/LoginForm";

const LoginPage = () => {

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
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
