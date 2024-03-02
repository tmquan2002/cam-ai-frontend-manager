import { useMemo, useState } from "react";
import {
  GetShopListHookParams,
  useGetShopList,
} from "../../hooks/useGetShopList";
import { useForm } from "@mantine/form";
import {
  IconAlignBoxCenterStretch,
  IconFilter,
  IconPhoneCall,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { mapLookupToArray } from "../../utils/helperFunction";
import { ShopStatus } from "../../models/CamAIEnum";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Menu,
  NumberInput,
  Pagination,
  Paper,
  Table,
  Text,
  TextInput,
  Tooltip,
  rem,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import classes from "./ShopListPage.module.scss";
import _ from "lodash";
import { IMAGE_CONSTANT } from "../../types/constant";

type SearchShopField = {
  status: string | null;
};

const SearchCategory = {
  NAME: (
    <IconAlignBoxCenterStretch
      size={"1.2rem"}
      stroke={1.5}
    />
  ),
  PHONE: (
    <IconPhoneCall
      size={"1.2rem"}
      stroke={1.5}
    />
  ),
};

const ShopListPage = () => {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);

  const [activePage, setPage] = useState(1);
  const form = useForm<SearchShopField>({
    initialValues: {
      status: null,
    },
  });

  const [search, setSearch] = useState<string | number>("");
  const [debounced] = useDebouncedValue(search, 400);
  const [searchCategory, setSearchCategory] = useState<JSX.Element>(
    SearchCategory.NAME
  );

  const searchParams: GetShopListHookParams = useMemo(() => {
    let sb: GetShopListHookParams = {
      size: 12,
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
      <Table.Tr
        key={index}
        onClick={() => navigate(`shop/${row.id}`)}
      >
        <Table.Td>
          <Text
            className={classes["pointer-style"]}
            c={"blue"}
          >
            {row.name}
          </Text>
        </Table.Td>
        <Table.Td>{row.addressLine}</Table.Td>
        <Table.Td>{row.phone}</Table.Td>
        <Table.Td>
          {_.isEqual(row.shopStatus, "Active") ? (
            <Badge variant="light">Active</Badge>
          ) : (
            <Badge
              color="gray"
              variant="light"
            >
              Disabled
            </Badge>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });

  const renderDropdownFilter = () => {
    return (
      <Menu transitionProps={{ transition: "pop-top-right" }}>
        <Tooltip label="Search by">
          <Menu.Target>
            <ActionIcon
              size={36}
              radius="xl"
              color={"blue"}
              variant="filled"
            >
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
              <IconPhoneCall
                size={"1.3rem"}
                stroke={1.5}
                color={"#15aabf"}
              />
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
    <Paper
      p={rem(32)}
      shadow="xs"
    >
      <Text
        size="lg"
        fw={"bold"}
        fz={25}
        c={"light-blue.4"}
      >
        Shop list
      </Text>
      <Flex
        align={"center"}
        my={"md"}
      >
        {searchCategory == SearchCategory.NAME ? (
          <TextInput
            style={{ flex: 1 }}
            placeholder="Search by any field"
            classNames={{ input: classes.search_input }}
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
            classNames={{ input: classes.search_input }}
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
          variant="outline"
          h={rem(48)}
          onClick={() => {
            navigate("/brand/create/shop");
          }}
          ml={rem(12)}
          radius={"20%/50%"}
        >
          Add shop
        </Button>
      </Flex>
      <Collapse in={opened}>
        <Group>
          <EditAndUpdateForm fields={fields} />
          <Button
            variant="transparent"
            ml={"auto"}
            onClick={form.reset}
          >
            Clear all filter
          </Button>
        </Group>
      </Collapse>

      <Box
        mt={"md"}
        pos={"relative"}
      >
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
          <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            verticalSpacing={"md"}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Shop name</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Box>
      <Group
        justify="flex-end"
        mt="lg"
      >
        <Pagination
          value={activePage}
          onChange={setPage}
          total={Math.ceil((shopList?.totalCount ?? 0) / 12)}
        />
      </Group>
    </Paper>
  );
};

export default ShopListPage;
