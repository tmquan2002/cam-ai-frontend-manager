import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Image,
  Loader,
  Overlay,
  Pagination,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
  rem
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  IconFilter,
  IconMail,
  IconPhone,
  IconSearch
} from "@tabler/icons-react";
import cx from "clsx";
import * as _ from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import { useGetShopList } from "../../hooks/useGetShopList";
import { isEmpty } from "../../utils/helperFunction";
import classes from "./BrandDetailPage.module.scss";

const BrandDetailPageManager = () => {
  const [search, setSearch] = useState<string>("");
  const [activePage, setPage] = useState(1);
  const navigate = useNavigate();
  const [debounced] = useDebouncedValue(search, 400);
  const [scrolled, setScrolled] = useState(false);
  const { data, isLoading, isError } = useGetBrandList({ size: 1 });
  const { data: shopList, isLoading: isShopListLoading } = useGetShopList({
    size: 12,
    name: debounced,
    enabled: !isEmpty(data?.values[0].id),
    brandId: data?.values[0].id,
    pageIndex: activePage - 1,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const rows = shopList?.values.map((row, index) => {
    if (isShopListLoading) return <Loader />;

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

  if (isError)
    return (
      <Card
        radius="md"
        m={rem(32)}
        className={classes.card}
      >
        <Overlay
          className={classes.overlay}
          opacity={0.55}
          zIndex={0}
        />

        <div className={classes.content}>
          <Text
            size="lg"
            fw={700}
            className={classes.title}
          >
            Plan & save
          </Text>

          <Text
            size="sm"
            className={classes.description}
          >
            Save up to 25% at Fifth Season Hotels in Europe, the Middle East,
            Africa and Asia Pacific
          </Text>

          <Button
            className={classes.action}
            variant="white"
            color="dark"
            size="xs"
          >
            Book now
          </Button>
        </div>
      </Card>
    );

  return (
    <Paper
      p={rem(32)}
      style={{ flex: 1 }}
    >
      {data?.values[0].bannerUri &&
        <Tooltip label="Brand banner">
          <Image
            radius={"md"}
            bg={"#000"}
            height={200}
            fit="contain"
            src={data?.values[0].bannerUri}
          />
        </Tooltip>
      }

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

      <Flex
        align={"center"}
        my={"md"}
      >
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
          value={search}
          onChange={handleSearchChange}
        />
        <Button
          leftSection={<IconFilter size={14} />}
          variant="default"
          className={classes.filter_button}
        >
          Filter
        </Button>
      </Flex>

      <ScrollArea
        h={600}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          verticalSpacing={"md"}
        >
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>Shop name</Table.Th>
              <Table.Th>Address</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
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

export default BrandDetailPageManager;
