import { Box, Paper, Text, rem } from "@mantine/core";
import { Gender } from "../../../models/CamAIEnum";
import CreateShopManagerForm from "./CreateShopManagerForm";
import CustomBreadcrumb, { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Shop Manager",
    link: "/brand/account"
  },
  {
    title: "Add"
  }
]
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
    <>
      <Box pt={rem(20)} pl={rem(32)}>
        <CustomBreadcrumb items={breadcrumbs} goBack />
      </Box>
      <Paper
        m={rem(32)}
        p={rem(32)}
      >
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"} mb={rem(30)} >
          New Shop Manager
        </Text>
        <CreateShopManagerForm mode="manager" />
      </Paper>
    </>
  );
};

export default CreateManagerPage;
