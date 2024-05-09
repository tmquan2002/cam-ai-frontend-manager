import {
  ActionIcon,
  Box,
  Button,
  Center,
  Collapse,
  Group,
  Image,
  LoadingOverlay,
  Menu,
  Pagination,
  Paper,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  IconAlignBoxCenterStretch,
  IconFilter,
  IconMail,
  IconPhoneCall,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetEmployeeListParams } from "../../apis/EmployeeAPI";
import StatusBadge from "../../components/badge/StatusBadge";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { EmployeeStatus } from "../../models/CamAIEnum";
import { IMAGE_CONSTANT, pageSizeSelect } from "../../types/constant";
import { mapLookupToArray, replaceIfNun } from "../../utils/helperFunction";
import * as _ from "lodash";

type SearchShopField = {
  employeeStatus: string | null;
};

const SearchCategory = {
  NAME: <IconAlignBoxCenterStretch size={"1rem"} stroke={1} />,
  EMAIL: <IconMail size={"1rem"} stroke={1} />,
  PHONE: <IconPhoneCall size={"1rem"} stroke={1} />,
};

const EmployeeListPage = () => {
  const form = useForm<SearchShopField>({
    initialValues: {
      employeeStatus: EmployeeStatus.Active,
    },
  });

  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<string | null>("5");
  const [search, setSearch] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<JSX.Element>(
    SearchCategory.NAME
  );
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
        spans: 12,
      },
    ];
  }, [form]);

  const searchParams: GetEmployeeListParams = useMemo(() => {
    let sb: GetEmployeeListParams = {
      size: Number(pageSize),
      pageIndex: activePage - 1,
      // employeeStatus: form.values.employeeStatus || EmployeeStatus.Active,
    };
    // if (searchCategory == SearchCategory.NAME) {
    // sb.search = debounced.toString();
    // } else if (searchCategory == SearchCategory.EMAIL) {
    //   sb.email = debounced.toString();
    // } else {
    //   sb.phone = debounced.toString();
    // }
    sb = _.omitBy(sb, _.isNil) as GetEmployeeListParams;
    sb = _.omitBy(sb, _.isNaN) as GetEmployeeListParams;
    return sb;
  }, [activePage, debounced, searchCategory, form]);

  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList(searchParams);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const rows = employeeList?.values?.map((row, index) => (
    <Tooltip label="View Employee" key={row.id} openDelay={300}>
      <Table.Tr
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/shop/employee/${row.id}`)}
      >
        <Table.Td>{index + 1 + Number(pageSize) * (activePage - 1)}</Table.Td>
        <Table.Td>{replaceIfNun(row.name)}</Table.Td>
        <Table.Td>{replaceIfNun(row.email)}</Table.Td>
        <Table.Td>{replaceIfNun(row.phone)}</Table.Td>
        <Table.Td>{replaceIfNun(row.birthday)}</Table.Td>
        <Table.Td>{replaceIfNun(row.gender)}</Table.Td>
        <Table.Td ta={"center"}>
          <StatusBadge statusName={row?.employeeStatus || "None"} />
        </Table.Td>
      </Table.Tr>
    </Tooltip>
  ));

  const renderDropdownFilter = () => {
    return (
      <Menu>
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
              <IconMail size={"1.3rem"} stroke={1.5} color="#E78C8C" />
            }
            onClick={() => {
              setSearch("");
              setSearchCategory(SearchCategory.EMAIL);
            }}
          >
            Email
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
    <Paper shadow="xs" p={"xs"} m={rem(32)} px={rem(32)} py={rem(20)}>
      <Group justify={"space-between"} mt={rem(20)} mb={rem(40)}>
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Employee list
        </Text>
        <Button
          onClick={() => navigate("/shop/employee/create")}
          leftSection={<IconPlus size={14} />}
        >
          Add Employee
        </Button>
      </Group>

      <Group align={"center"} mb={10}>
        <TextInput
          flex={1}
          placeholder="Search..."
          rightSectionWidth={40}
          leftSectionWidth={40}
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
          onClick={toggle}
        >
          Filter
        </Button>
      </Group>

      <Collapse in={opened} mb={20} ml={20} mr={20}>
        <Group justify="space-between">
          <EditAndUpdateForm fields={fields} />
          <Button variant="transparent" ml={"auto"} onClick={form.reset}>
            Clear all filter
          </Button>
        </Group>
      </Collapse>

      <Box pos={"relative"}>
        <LoadingOverlay
          visible={isGetEmployeeListLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 1 }}
        />
        {employeeList?.isValuesEmpty ? (
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
                  <Table.Th ta={"center"}>Status</Table.Th>
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
            total={Math.ceil(
              (employeeList?.totalCount ?? 0) / Number(pageSize)
            )}
          />
          {!employeeList?.isValuesEmpty && (
            <Select
              label="Page Size"
              allowDeselect={false}
              placeholder="0"
              data={pageSizeSelect}
              defaultValue={"5"}
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

export default EmployeeListPage;
