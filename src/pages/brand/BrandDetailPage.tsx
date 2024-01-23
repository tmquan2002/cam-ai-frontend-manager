import {
  Avatar,
  Badge,
  Box,
  Flex,
  Image,
  Loader,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
  rem,
} from "@mantine/core";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import { IconMail, IconPhone, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import cx from "clsx";
import classes from "./BrandDetailPage.module.scss";
import { useGetShopList } from "../../hooks/useGetShopList";
import { isEmpty } from "../../utils/helperFunction";
import { useDebouncedValue } from "@mantine/hooks";
import * as _ from "lodash";

const BrandDetailPage = () => {
  const [search, setSearch] = useState<string>("");
  const [debounced] = useDebouncedValue(search, 400);
  const [scrolled, setScrolled] = useState(false);
  const { data, isLoading } = useGetBrandList({ size: 1 });
  const { data: shopList, isLoading: isShopListLoading } = useGetShopList({
    size: 999,
    name: debounced,
    enabled: !isEmpty(data?.values[0].id),
    brandId: data?.values[0].id,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const rows = shopList?.values.map((row, index) => {
    if (isShopListLoading) return <Loader />;
    return (
      <Table.Tr key={index}>
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
          {_.isEqual(row.shopStatus.name, "Active") ? (
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

  if (isLoading) {
    return <Loader />;
  }
  return (
    <Paper
      p={rem(32)}
      style={{ flex: 1 }}
    >
      <Flex
        align={"center"}
        mb={rem(32)}
      >
        <Tooltip label="Brand logo">
          <Avatar
            mr={rem(32)}
            h={100}
            w={100}
            src={data?.values[0].logoUri}
          />
        </Tooltip>
        <Box>
          <Text
            size="xl"
            fw={500}
            mb={rem(8)}
          >
            {data?.values[0].name}
          </Text>

          <Flex>
            <Box mr={rem(8)}>
              <IconMail width={20} />
            </Box>
            {data?.values[0].email}
          </Flex>
          <Flex>
            <Box mr={rem(8)}>
              <IconPhone width={20} />
            </Box>
            {data?.values[0].phone}
          </Flex>
        </Box>
      </Flex>

      <Tooltip label="Brand banner">
        <Image
          radius={"md"}
          bg={"#000"}
          height={400}
          fit="contain"
          src={data?.values[0].bannerUri}
        />
      </Tooltip>

      <TextInput
        mt={rem(32)}
        placeholder="Search by any field"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
      />
      <ScrollArea
        h={600}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          highlightOnHover
          miw={700}
          verticalSpacing={"md"}
        >
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>Shop name</Table.Th>
              <Table.Th>Address</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
};

export default BrandDetailPage;
