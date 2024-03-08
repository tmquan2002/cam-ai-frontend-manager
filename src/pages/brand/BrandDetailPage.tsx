import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Collapse,
  Flex,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Menu,
  NumberInput,
  Overlay,
  Pagination,
  Paper,
  ScrollArea,
  Skeleton,
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
  IconPhone,
  IconPhoneCall,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import cx from "clsx";
import * as _ from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import {
  GetShopListHookParams,
  useGetShopList,
} from "../../hooks/useGetShopList";
import { isEmpty, mapLookupToArray } from "../../utils/helperFunction";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import classes from "./BrandDetailPage.module.scss";
import { useUploadBrandImage } from "../../hooks/useUploadBrandImage";
import { UploadBrandImageType } from "../../apis/BrandAPI";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import { notifications } from "@mantine/notifications";
import { IMAGE_CONSTANT } from "../../types/constant";
import { ShopStatus } from "../../models/CamAIEnum";

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

const BrandDetailPageManager = () => {
  const form = useForm<SearchShopField>({
    initialValues: {
      status: null,
    },
  });

  const [search, setSearch] = useState<string | number>("");
  const [opened, { toggle }] = useDisclosure(false);
  const [activePage, setPage] = useState(1);
  const navigate = useNavigate();
  const [debounced] = useDebouncedValue(search, 400);
  const [scrolled, setScrolled] = useState(false);
  const [searchCategory, setSearchCategory] = useState<JSX.Element>(
    SearchCategory.NAME
  );
  const { data, isLoading, isError, refetch } = useGetBrandList({ size: 1 });
  const { mutate: uploadBrandBanner, isLoading: isUploadBrandBannerLoading } =
    useUploadBrandImage();

  const { mutate: uploadBrandLogo, isLoading: isUploadBrandLogoLoading } =
    useUploadBrandImage();

  const searchParams: GetShopListHookParams = useMemo(() => {
    let sb: GetShopListHookParams = {
      size: 12,
      enabled: !isEmpty(data?.values[0].id),
      brandId: data?.values[0].id,
      pageIndex: activePage - 1,
      status: form.values.status ?? null,
    };
    if (searchCategory == SearchCategory.NAME) {
      sb.name = debounced.toString();
    } else {
      sb.phone = debounced.toString();
    }
    sb = _.omitBy(sb, _.isNil) as GetShopListHookParams;
    sb = _.omitBy(sb, _.isNaN) as GetShopListHookParams;
    return sb;
  }, [activePage, data?.values, debounced, form.values.status, searchCategory]);

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


  const handleUploadBrandImage = async (
    files: FileWithPath[],
    uploadType: UploadBrandImageType
  ) => {
    if (!files || files.length <= 0) {
      return;
    }
    if (uploadType == UploadBrandImageType.Banner) {
      uploadBrandBanner(
        { file: files[0], type: uploadType },
        {
          onSuccess() {
            refetch();
          },
          onError(data) {
            const error = data as AxiosError<ResponseErrorDetail>;
            notifications.show({
              color: "red",
              title: "Failed",
              message: error.response?.data?.message,
            });
          },
        }
      );
    } else {
      uploadBrandLogo(
        { file: files[0], type: uploadType },
        {
          onSuccess() {
            refetch();
          },
          onError(data) {
            const error = data as AxiosError<ResponseErrorDetail>;
            notifications.show({
              color: "red",
              title: "Failed",
              message: error.response?.data?.message,
            });
          },
        }
      );
    }
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

  if (isLoading) {
    return (
      <Paper
        p={rem(32)}
        style={{ flex: 1 }}
        pos={"relative"}
        h={"100vh"}
      >
        <LoadingOverlay visible={isLoading} />
      </Paper>
    );
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
    <>
      <Paper
        p={rem(32)}
        style={{ flex: 1 }}
      >
        <Box mb={rem(16)}>
          {isUploadBrandBannerLoading ? (
            <Loader />
          ) : (
            <Tooltip label="Brand banner">
              <Dropzone
                onDrop={(files) =>
                  handleUploadBrandImage(files, UploadBrandImageType.Banner)
                }
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                maxFiles={1}
                accept={{
                  "image/*": [],
                }}
              >
                {data?.values[0]?.banner ? (
                  <Image
                    radius={"md"}
                    bg={"#000"}
                    height={280}
                    fit="contain"
                    src={data?.values[0]?.banner?.hostingUri}
                  />
                ) : (
                  <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: "none" }}
                  >
                    <Dropzone.Accept>
                      <IconUpload
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-blue-6)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-red-6)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-dimmed)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Idle>

                    <div>
                      <Text
                        size="xl"
                        inline
                      >
                        Upload brand banner
                      </Text>
                      <Text
                        size="sm"
                        c="dimmed"
                        inline
                        mt={7}
                      >
                        Only accept .png - .jpeg - .svg+xml - .gif file that are
                        less than 10mb in size
                      </Text>
                    </div>
                  </Group>
                )}
              </Dropzone>
            </Tooltip>
          )}
        </Box>

        <Flex
          align={"center"}
          mb={rem(32)}
        >
          <Tooltip label="Brand logo">
            <Dropzone
              mr={rem(16)}
              onDrop={(files) =>
                handleUploadBrandImage(files, UploadBrandImageType.Logo)
              }
              onReject={(files) => console.log("rejected files", files)}
              style={{ border: 0 }}
              maxSize={5 * 1024 ** 2}
              maxFiles={1}
              accept={{
                "image/*": [],
              }}
            >
              {isUploadBrandLogoLoading ? (
                <Skeleton
                  height={100}
                  circle
                />
              ) : (
                <Avatar
                  h={100}
                  w={100}
                  src={
                    data?.values[0]?.logo?.hostingUri ?? IMAGE_CONSTANT.NO_IMAGE
                  }
                  className={classes.avatar}
                />
              )}
            </Dropzone>
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

        <ScrollArea
          h={600}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
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
          )}
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
    </>
  );
};

export default BrandDetailPageManager;
