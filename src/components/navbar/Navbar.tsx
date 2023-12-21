import styled from "../../styles/navbar/navbar.module.scss";
import Logo from "../../assets/images/milease_icon.png"
import { Button, Group } from "@mantine/core";

export const MileaseNavbar = () => {

    return (
        <div className={styled["container-main"]}>
            <img src={Logo} alt="Logo" className={styled["logo"]} />
            <div className={styled["navlink-main-container"]}>
                <Group>
                    <Button color="pale-red.5">Login</Button>
                </Group>
            </div>
        </div>
    )
};

export default MileaseNavbar;