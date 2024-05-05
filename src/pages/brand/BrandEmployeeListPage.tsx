import { Box, Center, Flex, Group, Image, LoadingOverlay, Pagination, Paper, Table, Text, TextInput, Tooltip, rem, } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/badge/StatusBadge";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { EmployeeDetail } from "../../models/Employee";
import { IMAGE_CONSTANT } from "../../types/constant";
import { replaceIfNun } from "../../utils/helperFunction";
import classes from "./BrandEmployeeListPage.module.scss";

const BrandEmployeeListPage = () => {
  const navigate = useNavigate();
  const [activePage, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const [debounced] = useDebouncedValue(search, 400);

  const { data, isLoading } = useGetEmployeeList({
    size: 8,
    pageIndex: activePage - 1,
    search: debounced,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const rows = data?.values.map((row: EmployeeDetail, index) => (
    <Table.Tr
      key={row?.id}
      onClick={() => navigate(`/brand/employee/${row?.id}`)}
    >
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>
        <Tooltip label="View Employee" withArrow position="top-start">
          <Text size={rem(14)} className={classes.clickable_link} c="blue">
            {replaceIfNun(row?.name)}
          </Text>
        </Tooltip>
      </Table.Td>
      <Table.Td>{replaceIfNun(row?.email)}</Table.Td>
      <Table.Td>{replaceIfNun(row?.phone)}</Table.Td>
      <Table.Td>{replaceIfNun(row?.birthday)}</Table.Td>
      <Table.Td>{replaceIfNun(row?.gender)}</Table.Td>
      <Table.Td ta={"center"}>
        <StatusBadge statusName={row.employeeStatus} />
      </Table.Td>
      <Table.Td>
        <Tooltip label="View Shop" withArrow position="top-start">
          <Text c="blue"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/brand/shop/${row?.shop?.id}`);
            }}
            size={rem(14)}
            className={classes.clickable_link}
          >
            {row?.shop?.name}
          </Text>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper m={rem(32)} mb={0} p={rem(32)} pb={rem(48)} shadow="xl">
      <Group pb={12} justify="space-between">
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Employee List
        </Text>
      </Group>

      <Flex align={"center"} my={"md"}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Search..."
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
        {/* <Button
          leftSection={<IconPlus size={14} />}
          ml={rem(12)}
          radius={"xl"}
          onClick={() => navigate("/brand/create/employee")}
          h={rem(48)}
        >
          Add employee
        </Button> */}
      </Flex>

      <Box pos={"relative"} pl={20} pr={20}>
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
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Birthday</Table.Th>
                <Table.Th>Gender</Table.Th>
                <Table.Th ta={"center"}>Status</Table.Th>
                <Table.Th>Shop</Table.Th>
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

export default BrandEmployeeListPage;
