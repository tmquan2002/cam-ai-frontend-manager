import {
  Badge,
  Box,
  Button,
  Center,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  Table,
  Text,
  rem,
} from "@mantine/core";
import { useGetAccountList } from "../../hooks/useGetAccounts";
import { replaceIfNun } from "../../utils/helperFunction";
import { AccountStatus } from "../../models/CamAIEnum";
import { IMAGE_CONSTANT } from "../../types/constant";
import { IconPlus } from "@tabler/icons-react";
import classes from "./BrandAccountPage.module.scss";

const BrandAccountPage = () => {
  //   const navigate = useNavigate();
  const { data, isLoading } = useGetAccountList({});

  const renderAccountStatusRow = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.Active:
        return <Badge>{status}</Badge>;
      case AccountStatus.New:
        return <Badge color="orange">{status}</Badge>;
      case AccountStatus.Inactive:
        return <Badge color="gray">{status}</Badge>;
    }
  };

  const rows = data?.values.map((row) => (
    <Table.Tr key={row?.id}>
      <Table.Td>
        <Text className={classes.clickable_link}>
          {replaceIfNun(row?.name)}
        </Text>
      </Table.Td>
      <Table.Td>{replaceIfNun(row?.email)}</Table.Td>
      <Table.Td>{replaceIfNun(row?.phone)}</Table.Td>
      <Table.Td>{replaceIfNun(row?.birthday)}</Table.Td>
      <Table.Td>{replaceIfNun(row?.gender)}</Table.Td>
      <Table.Td>{replaceIfNun(row?.addressLine)}</Table.Td>
      <Table.Td>{renderAccountStatusRow(row?.accountStatus)}</Table.Td>
      <Table.Td>
        <Text className={classes.clickable_link}>
          {row?.managingShop?.name}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Paper
      m={rem(32)}
      mb={0}
      p={rem(32)}
      pb={rem(48)}
      shadow="xl"
    >
      <Group
        pb={32}
        justify="space-between"
      >
        <Text
          size="lg"
          fw={"bold"}
          fz={25}
          c={"light-blue.4"}
        >
          Shop manager list
        </Text>
        <Button
          leftSection={<IconPlus size={14} />}
          ml={rem(12)}
        >
          Add shop
        </Button>
      </Group>
      <Box pos={"relative"}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 1 }}
        />
        <Table
          miw={1000}
          highlightOnHover
          verticalSpacing={"md"}
          striped
          withTableBorder
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Birthday</Table.Th>
              <Table.Th>Gender</Table.Th>
              <Table.Th>Address</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Managing shop</Table.Th>
            </Table.Tr>
          </Table.Thead>
          {data?.isValuesEmpty ? (
            <Center>
              <Image
                radius={"md"}
                src={IMAGE_CONSTANT.NO_DATA}
                fit="contain"
                h={rem(400)}
                w={"auto"}
                style={{
                  borderBottom: "1px solid #dee2e6",
                }}
              />
            </Center>
          ) : (
            <Table.Tbody>{rows}</Table.Tbody>
          )}
        </Table>
      </Box>
    </Paper>
  );
};

export default BrandAccountPage;
