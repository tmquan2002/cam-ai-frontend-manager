import {
  ActionIcon,
  Box, Button, Center, Collapse, Flex, Group, Image,
  LoadingOverlay, Menu, NumberInput, Pagination, Paper, Select, Table, Text, TextInput, Tooltip, rem
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconAlignBoxCenterStretch, IconFilter, IconPhoneCall, IconPlus, IconSearch, } from "@tabler/icons-react";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/badge/StatusBadge";
import EditAndUpdateForm, { FIELD_TYPES, } from "../../components/form/EditAndUpdateForm";
import { GetShopListHookParams, useGetShopList, } from "../../hooks/useGetShopList";
import { ShopStatus } from "../../models/CamAIEnum";
import { IMAGE_CONSTANT, pageSizeSelect } from "../../types/constant";
import { formatTime, mapLookupToArray } from "../../utils/helperFunction";
import classes from "./ShopListPage.module.scss";

type SearchShopField = {
  status: string | null;
};

const SearchCategory = {
  NAME: <IconAlignBoxCenterStretch size={"1rem"} stroke={1.5} />,
  PHONE: <IconPhoneCall size={"1rem"} stroke={1.5} />,
};

const ShopListPage = () => {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);

  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<string | null>("5");
  const form = useForm<SearchShopField>({
    initialValues: {
      status: null,
    },
  });

  const [search, setSearch] = useState<string | number>("");
  const [debounced] = useDebouncedValue(search, 400);
  const [searchCategory, setSearchCategory] = useState<JSX.Element>(
    SearchCategory.NAME,
  );

  const searchParams: GetShopListHookParams = useMemo(() => {
    let sb: GetShopListHookParams = {
      size: Number(pageSize),
      pageIndex: activePage - 1,
      status: form.values.status ?? null,
      enabled: true,
    };
    if (searchCategory == SearchCategory.NAME) {
      sb.name = debounced.toString();
    } else {
      sb.phone = debounced.toString();
    }
    sb = _.omitBy(sb, _.isNil) as GetShopListHookParams;
    sb = _.omitBy(sb, _.isNaN) as GetShopListHookParams;
    return sb;
  }, [activePage, debounced, form.values.status, searchCategory]);

  const { data: shopList, isLoading: isShopListLoading } =
    useGetShopList(searchParams);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.RADIO,
        fieldProps: {
          form,
          name: "status",
          placeholder: "Shop status",
          label: "Shop status",
          data: mapLookupToArray(ShopStatus ?? {}),
        },
      },
    ];
  }, [form]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const rows = shopList?.values.map((row, index) => {
    return (
      <Tooltip label="View shop detail" withArrow openDelay={300} key={index}>
        <Table.Tr onClick={() => navigate(`/brand/shop/${row.id}`)}>
          <Table.Td>{index + 1 + Number(pageSize) * (activePage - 1)}</Table.Td>
          <Table.Td>{row.name}</Table.Td>
          <Table.Td>{row.addressLine}</Table.Td>
          <Table.Td>{formatTime(row.openTime, false, false)}</Table.Td>
          <Table.Td>{formatTime(row.closeTime, false, false)}</Table.Td>
          <Table.Td>{row.phone}</Table.Td>
          <Table.Td>
            {row?.shopManager ? row.shopManager?.name : "No manager"}
          </Table.Td>
          <Table.Td ta={"center"}>
            <StatusBadge statusName={row.shopStatus} size="sm" padding={10} />
          </Table.Td>
        </Table.Tr>
      </Tooltip>
    );
  });

  const renderDropdownFilter = () => {
    return (
      <Menu transitionProps={{ transition: "pop-top-right" }}>
        <Tooltip label="Search by">
          <Menu.Target>
            <ActionIcon size={25} color={"blue"} variant="filled">
              {searchCategory}
            </ActionIcon>
          </Menu.Target>
        </Tooltip>

        <Menu.Dropdown>
          <Menu.Label>Search by</Menu.Label>
          <Menu.Item
            leftSection={
              <IconAlignBoxCenterStretch
                size={"1.3rem"}
                stroke={1.5}
                color="#228be6"
              />
            }
            onClick={() => {
              setSearch("");
              setSearchCategory(SearchCategory.NAME);
            }}
          >
            Name
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconPhoneCall size={"1.3rem"} stroke={1.5} color={"#15aabf"} />
            }
            onClick={() => {
              setSearch("");
              setSearchCategory(SearchCategory.PHONE);
            }}
          >
            Phone
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  return (
    <Paper m={rem(32)} mb={0} p={rem(32)} pb={rem(48)} shadow="xl">
      <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
        Shop list
      </Text>
      <Flex align={"center"} my={"md"}>
        {searchCategory == SearchCategory.NAME ? (
          <TextInput
            style={{ flex: 1 }}
            placeholder="Search by any field"
            rightSectionWidth={52}
            leftSectionWidth={52}
            leftSection={
              <IconSearch
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            rightSection={renderDropdownFilter()}
            value={search}
            onChange={handleSearchChange}
          />
        ) : (
          <NumberInput
            style={{ flex: 1 }}
            placeholder="Search by any field"
            rightSectionWidth={52}
            leftSectionWidth={52}
            leftSection={
              <IconSearch
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            rightSection={renderDropdownFilter()}
            value={search}
            onChange={setSearch}
          />
        )}
        <Button
          leftSection={<IconFilter size={14} />}
          variant="default"
          className={classes.filter_button}
          onClick={toggle}
        >
          Filter
        </Button>
        <Button
          leftSection={<IconPlus size={14} />}
          onClick={() => {
            navigate("/brand/create/shop");
          }}
        >
          Add shop
        </Button>
      </Flex>
      <Collapse in={opened}>
        <Group>
          <EditAndUpdateForm fields={fields} />
          <Button variant="transparent" ml={"auto"} onClick={form.reset}>
            Clear all filter
          </Button>
        </Group>
      </Collapse>

      <Box mt={"md"} pos={"relative"} pl={20} pr={20}>
        <LoadingOverlay
          visible={isShopListLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 1 }}
        />
        {shopList?.isValuesEmpty ? (
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
            <Table
              miw={1000}
              highlightOnHover
              verticalSpacing={"md"}
              striped
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Shop name</Table.Th>
                  <Table.Th>Address</Table.Th>
                  <Table.Th>Open time</Table.Th>
                  <Table.Th>Close time</Table.Th>
                  <Table.Th>Phone</Table.Th>
                  <Table.Th>Shop manager</Table.Th>
                  <Table.Th ta={"center"}>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Box>
      <Group justify="space-between" align="end">
        <Pagination
          value={activePage}
          onChange={setPage}
          total={Math.ceil((shopList?.totalCount ?? 0) / Number(pageSize))}
        />
        <Select
          label="Page Size"
          allowDeselect={false}
          placeholder="0"
          data={pageSizeSelect} defaultValue={"5"}
          value={pageSize}
          onChange={(value) => {
            setPageSize(value)
            setPage(1)
          }}
        />
      </Group>
    </Paper>
  );
};

export default ShopListPage;
