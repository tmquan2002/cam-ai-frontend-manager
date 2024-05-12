import { ActionIcon, Box, Button, Center, Collapse, Group, Image, LoadingOverlay, Menu, Pagination, Paper, Select, Table, Text, TextInput, Tooltip, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconAlignBoxCenterStretch, IconFilter, IconMail, IconPhoneCall, IconSearch } from "@tabler/icons-react";
import * as _ from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetEmployeeListParams } from "../../apis/EmployeeAPI";
import StatusBadge from "../../components/badge/StatusBadge";
import EditAndUpdateForm, { FIELD_TYPES } from "../../components/form/EditAndUpdateForm";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { useGetShopList } from "../../hooks/useGetShopList";
import { EmployeeStatus } from "../../models/CamAIEnum";
import { EmployeeDetail } from "../../models/Employee";
import { IMAGE_CONSTANT, PAGE_SIZE_SELECT } from "../../types/constant";
import { mapLookupToArray, replaceIfNun } from "../../utils/helperFunction";
import classes from "./BrandEmployeeListPage.module.scss";

type SearchShopField = {
  employeeStatus: string | null;
  shopId: string | null;
};

const SearchCategory = {
  NAME: <IconAlignBoxCenterStretch size={"1.2rem"} stroke={1.5} />,
  EMAIL: <IconMail size={"1.2rem"} stroke={1.5} />,
  PHONE: <IconPhoneCall size={"1.2rem"} stroke={1.5} />,
};

const BrandEmployeeListPage = () => {
  const form = useForm<SearchShopField>({
    initialValues: {
      employeeStatus: EmployeeStatus.Active,
      shopId: null,
    },
  });

  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<string | null>("20");
  const [search, setSearch] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<JSX.Element>(SearchCategory.NAME);
  const { data: shopList, isLoading: isLoadingShop } = useGetShopList({ enabled: true, size: 999 });
  const [debounced] = useDebouncedValue(search, 500);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.RADIO,
        fieldProps: {
          form,
          name: "employeeStatus",
          placeholder: "Employee Status",
          label: "Employee status",
          data: mapLookupToArray(EmployeeStatus ?? {}),
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Shop",
          placeholder: "Shop",
          data: shopList?.values?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          name: "shopId",
          loading: isLoadingShop,
          searchable: true,
        },
        spans: 6,
      },
    ];
  }, [form]);

  const searchParams: GetEmployeeListParams = useMemo(() => {
    let sb: GetEmployeeListParams = {
      size: Number(pageSize),
      shopId: form.values.shopId,
      pageIndex: activePage - 1,
      employeeStatus: form.values.employeeStatus || EmployeeStatus.Active,
    };
    // if (searchCategory == SearchCategory.NAME) {
    sb.search = debounced.toString() || "";
    // } else if (searchCategory == SearchCategory.EMAIL) {
    //   sb.email = debounced.toString();
    // } else {
    //   sb.phone = debounced.toString();
    // }
    sb = _.omitBy(sb, _.isNil) as GetEmployeeListParams;
    sb = _.omitBy(sb, _.isNaN) as GetEmployeeListParams;
    return sb;
  }, [activePage, shopList?.values, debounced, searchCategory, form]);

  const { data, isLoading } = useGetEmployeeList(searchParams);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const rows = data?.values.map((row: EmployeeDetail, index) => (
    <Table.Tr
      key={row?.id}
      onClick={() => navigate(`/brand/employee/${row?.id}`)}
    >
      <Table.Td>{index + 1 + Number(pageSize) * (activePage - 1)}</Table.Td>
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
        <StatusBadge statusName={row.employeeStatus} padding={10} size="sm"/>
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

  const renderDropdownFilter = () => {
    return (
      <Menu>
        <Tooltip label="Search by">
          <Menu.Target>
            <ActionIcon size={30} color={"blue"} variant="filled">
              {searchCategory}
            </ActionIcon>
          </Menu.Target>
        </Tooltip>

        <Menu.Dropdown>
          <Menu.Label>Search by</Menu.Label>
          <Menu.Item leftSection={<IconAlignBoxCenterStretch size={"1.3rem"} stroke={1.5} color="#228be6" />}
            onClick={() => { setSearch(""); setSearchCategory(SearchCategory.NAME); }}
          >
            Name
          </Menu.Item>
          <Menu.Item leftSection={<IconMail size={"1.3rem"} stroke={1.5} color="#E78C8C" />}
            onClick={() => { setSearch(""); setSearchCategory(SearchCategory.EMAIL); }}
          >
            Email
          </Menu.Item>
          <Menu.Item leftSection={<IconPhoneCall size={"1.3rem"} stroke={1.5} color={"#15aabf"} />}
            onClick={() => { setSearch(""); setSearchCategory(SearchCategory.PHONE); }}
          >
            Phone
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  if (isLoadingShop) {
    return (
      <Paper p={rem(32)} style={{ flex: 1 }} pos={"relative"} h={"100vh"}>
        <LoadingOverlay visible={isLoadingShop} />
      </Paper>
    );
  }

  return (
    <Paper m={rem(32)} p={rem(32)} shadow="xl">
      <Group pb={12} justify="space-between">
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Employee List
        </Text>
      </Group>

      <Group align={"center"} mb={10}>
        <TextInput
          flex={1}
          placeholder="Search..."
          classNames={{ input: classes.search_input }}
          rightSectionWidth={54}
          leftSectionWidth={54}
          leftSection={
            <IconSearch
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          }
          rightSection={renderDropdownFilter()}
          value={search}
          onChange={handleSearchChange}
        />
        <Button
          leftSection={<IconFilter size={14} />}
          variant="default"
          className={classes.filter_button}
          onClick={toggle}
        >
          Filter
        </Button>
      </Group>

      <Collapse in={opened} mb={20} ml={20} mr={20}>
        <Group justify="space-between">
          <EditAndUpdateForm fields={fields} />
          <Button variant="transparent" ml={"auto"}
            onClick={form.reset}>
            Clear all filter
          </Button>
        </Group>
      </Collapse>

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
            <Table highlightOnHover verticalSpacing={"sm"} striped miw={1000}>
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
          </Table.ScrollContainer>
        )}
        <Group justify="space-between" align="end">
          <Pagination
            value={activePage}
            onChange={setPage}
            total={Math.ceil((data?.totalCount ?? 0) / Number(pageSize))}
          />
          {!data?.isValuesEmpty &&
            <Select
              label="Page Size"
              allowDeselect={false}
              placeholder="0"
              data={PAGE_SIZE_SELECT} defaultValue={"20"}
              value={pageSize}
              onChange={(value) => {
                setPageSize(value)
                setPage(1)
              }}
            />
          }
        </Group>
      </Box>
    </Paper>
  );
};

export default BrandEmployeeListPage;
