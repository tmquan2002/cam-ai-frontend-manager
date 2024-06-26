import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Pagination,
  Paper,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
  rem,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/badge/StatusBadge";
import { useGetAccountList } from "../../hooks/useGetAccounts";
import { AccountDetail } from "../../models/Account";
import { DEFAULT_PAGE_SIZE, IMAGE_CONSTANT, PAGE_SIZE_SELECT } from "../../types/constant";
import { replaceIfNun } from "../../utils/helperFunction";
import classes from "./BrandShopManagerListPage.module.scss";
import { useTaskBrand } from "../../routes/BrandRoute";
import { Role } from "../../models/CamAIEnum";

const BrandShopManagerListPage = () => {
  const navigate = useNavigate();
  const { taskId } = useTaskBrand();
  const [search, setSearch] = useState<string>("");
  const [debounced] = useDebouncedValue(search, 400);
  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<string | null>(DEFAULT_PAGE_SIZE);

  const { data, isLoading } = useGetAccountList({
    size: Number(pageSize) ?? DEFAULT_PAGE_SIZE,
    pageIndex: activePage - 1,
    name: debounced,
    role: Role.ShopManager,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const rows = data?.values.map((row: AccountDetail, index) => (
    <Table.Tr key={row?.id}>
      <Table.Td>{index + 1 + Number(pageSize) * (activePage - 1)}</Table.Td>
      <Table.Td>
        <Tooltip label="View Shop Manager" withArrow position="top-start">
          <Text
            onClick={() => navigate(`/brand/account/${row?.id}`)}
            size={rem(14)}
            c="blue"
            className={classes.clickable_link}
          >
            {replaceIfNun(row?.name)}
          </Text>
        </Tooltip>
      </Table.Td>
      <Table.Td>{replaceIfNun(row?.email)}</Table.Td>
      <Table.Td>{replaceIfNun(row?.phone)}</Table.Td>
      <Table.Td>{replaceIfNun(row?.birthday)}</Table.Td>
      <Table.Td>{replaceIfNun(row?.gender)}</Table.Td>
      <Table.Td ta="center">
        <StatusBadge statusName={row?.accountStatus} size="sm" padding={10} />
      </Table.Td>
      <Table.Td ta="left">
        {row?.managingShop ? (
          <Tooltip label="View Shop" withArrow position="top-end">
            <Text
              onClick={() => navigate(`/brand/shop/${row?.managingShop?.id}`)}
              size={rem(14)}
              c="blue"
              className={classes.clickable_link}
            >
              {row?.managingShop?.name}
            </Text>
          </Tooltip>
        ) : (
          <>None</>
        )}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Paper m={rem(32)} mb={0} p={rem(32)} pb={rem(48)} shadow="xl">
      <Group pb={12} justify="space-between">
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Shop Managers
        </Text>
      </Group>

      <Flex align={"center"} my={"md"}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Search by name"
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
          ml={rem(20)}
          leftSection={<IconPlus size={14} />}
          onClick={() => navigate("/brand/create/manager")}
          disabled={taskId != undefined}
        >
          Add manager
        </Button>
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
          <Table.ScrollContainer minWidth={1000}>
            <Table miw={1000} highlightOnHover verticalSpacing={"md"} striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Phone</Table.Th>
                  <Table.Th>Birthday</Table.Th>
                  <Table.Th>Gender</Table.Th>
                  <Table.Th ta="center">Status</Table.Th>
                  <Table.Th ta="left">Managing shop</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
        <Group justify="space-between" align="end">
          <Pagination
            value={activePage}
            onChange={setPage}
            total={Math.ceil((data?.totalCount ?? 0) / Number(pageSize))}
          />
          {!data?.isValuesEmpty && (
            <Select
              label="Page Size"
              allowDeselect={false}
              placeholder="0"
              data={PAGE_SIZE_SELECT}
              defaultValue={DEFAULT_PAGE_SIZE}
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setPage(1);
              }}
            />
          )}
        </Group>
      </Box>
    </Paper>
  );
};

export default BrandShopManagerListPage;
