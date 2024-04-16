import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Pagination,
  Paper,
  Table,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { useGetAccountList } from "../../hooks/useGetAccounts";
import { replaceIfNun } from "../../utils/helperFunction";
import { AccountStatus } from "../../models/CamAIEnum";
import { IMAGE_CONSTANT } from "../../types/constant";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import classes from "./BrandAccountPage.module.scss";
import { useNavigate } from "react-router-dom";
import { AccountDetail } from "../../models/Account";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";

const BrandAccountPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  const [debounced] = useDebouncedValue(search, 400);

  const [activePage, setPage] = useState(1);

  const { data, isLoading } = useGetAccountList({
    size: 12,
    pageIndex: activePage - 1,
    name: debounced,
  });

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const rows = data?.values.map((row: AccountDetail) => (
    <Table.Tr
      key={row?.id}
      onClick={() => navigate(`/brand/account/${row?.id}`)}
    >
      <Table.Td>
        <Text size={rem(14)} className={classes.clickable_link}>
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
        <Text
          onClick={() => navigate(`/brand/shop/${row?.managingShop?.id}`)}
          size={rem(14)}
          className={classes.clickable_link}
        >
          {row?.managingShop?.name}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Paper m={rem(32)} mb={0} p={rem(32)} pb={rem(48)} shadow="xl">
      <Group pb={12} justify="space-between">
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Shop manager list
        </Text>
      </Group>

      <Flex align={"center"} my={"md"}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Search by name"
          classNames={{ input: classes.search_input }}
          rightSectionWidth={52}
          leftSectionWidth={52}
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
        <Button
          ml={rem(24)}
          leftSection={<IconPlus size={14} />}
          onClick={() => navigate("/brand/create/manager")}
        >
          Add manager
        </Button>
      </Flex>
      <Box pos={"relative"}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 1 }}
        />

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
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
        <Group justify="flex-end" mt="lg">
          <Pagination
            value={activePage}
            onChange={setPage}
            total={Math.ceil((data?.totalCount ?? 0) / 12)}
          />
        </Group>
      </Box>
    </Paper>
  );
};

export default BrandAccountPage;
