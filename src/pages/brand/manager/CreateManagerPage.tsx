import { Paper, Text, rem } from "@mantine/core";
import { Gender } from "../../../models/CamAIEnum";
import CreateShopManagerForm from "./CreateShopManagerForm";

export type CreateAccountField = {
  email: string;
  password: string;
  name: string;
  gender: Gender;
  phone: string;
  birthday: Date | null;
  wardId: string;
  addressLine: string;
  province: string;
  district: string;
};

export type MassAddField = {
  file: File | null;
}

const CreateManagerPage = () => {
  return (
    <Paper
      m={rem(32)}
      p={rem(32)}
    >
      <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"} mb={rem(30)} >
        New shop manager
      </Text>
      <CreateShopManagerForm mode="manager"/>
    </Paper>
  );
};

export default CreateManagerPage;
