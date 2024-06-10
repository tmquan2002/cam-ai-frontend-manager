import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Collapse,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Menu,
  NumberInput,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Table,
  Text,
  TextInput,
  Tooltip,
  rem
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlignBoxCenterStretch,
  IconFilter,
  IconMail,
  IconNetwork,
  IconPhone,
  IconPhoneCall,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import * as _ from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadBrandImageType } from "../../apis/BrandAPI";
import StatusBadge from "../../components/badge/StatusBadge";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import LoadingImage from "../../components/image/LoadingImage";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import {
  GetShopListHookParams,
  useGetShopList,
} from "../../hooks/useGetShopList";
import { useUploadBrandImage } from "../../hooks/useUploadBrandImage";
import { ShopStatus } from "../../models/CamAIEnum";
import { ResponseErrorDetail } from "../../models/Response";
import { useTaskBrand } from "../../routes/BrandRoute";
import { DEFAULT_PAGE_SIZE, IMAGE_CONSTANT, PAGE_SIZE_SELECT } from "../../types/constant";
import {
  formatTime,
  isEmpty,
  mapLookupToArray,
} from "../../utils/helperFunction";
import classes from "./BrandMainPage.module.scss";

type SearchShopField = {
  status: string | null;
};

const SearchCategory = {
  NAME: <IconAlignBoxCenterStretch size={"1.2rem"} stroke={1.5} />,
  PHONE: <IconPhoneCall size={"1.2rem"} stroke={1.5} />,
};

const BrandMainPage = () => {
  const form = useForm<SearchShopField>({
    initialValues: {
      status: null,
    },
  });

  const { taskId } = useTaskBrand();
  const [search, setSearch] = useState<string | number>("");
  const [opened, { toggle }] = useDisclosure(false);
  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<string | null>(DEFAULT_PAGE_SIZE);
  const navigate = useNavigate();
  const [debounced] = useDebouncedValue(search, 400);
  const [searchCategory, setSearchCategory] = useState<JSX.Element>(
    SearchCategory.NAME
  );
  const { data, isLoading, refetch } = useGetBrandList({ size: 1 });
  const { mutate: uploadBrandBanner } = useUploadBrandImage();
  const { mutate: uploadBrandLogo, isLoading: isUploadBrandLogoLoading } = useUploadBrandImage();

  const searchParams: GetShopListHookParams = useMemo(() => {
    let sb: GetShopListHookParams = {
      size: Number(pageSize) ?? DEFAULT_PAGE_SIZE,
      enabled: !isEmpty(data?.values?.[0]?.id),
      brandId: data?.values[0]?.id,
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
  }, [
    activePage,
    pageSize,
    data?.values,
    debounced,
    form.values.status,
    searchCategory,
  ]);

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
      <Tooltip label="View Shop" withArrow openDelay={300} key={index}>
        <Table.Tr onClick={() => navigate(`/brand/shop/${row.id}`)}>
          <Table.Td>{index + 1 + Number(pageSize) * (activePage - 1)}</Table.Td>
          <Table.Td>{row.name}</Table.Td>
          <Table.Td>{row.addressLine}</Table.Td>
          <Table.Td>{formatTime(row.openTime)}</Table.Td>
          <Table.Td>{formatTime(row.closeTime)}</Table.Td>
          <Table.Td>{row.phone}</Table.Td>

          <Table.Td ta="center">
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
            <ActionIcon size={30} color={"blue"} variant="filled">
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
    <Paper px={rem(32)} pt={32} pb={64} style={{ flex: 1 }} pos={"relative"}>
      {isLoading ? <LoadingOverlay visible={isLoading} /> :
        <Grid justify="space-around">
          <Grid.Col span={12}>
            {/* Banner section */}
            <Box>
              <Tooltip label="Brand banner">
                <Dropzone
                  onDrop={(files) =>
                    handleUploadBrandImage(files, UploadBrandImageType.Banner)
                  }
                  onReject={(files) => console.log("rejected files", files)}
                  style={{ border: 0, backgroundColor: 'transparent' }}
                  maxSize={5 * 1024 ** 2}

                  maxFiles={1}
                  accept={{
                    "image/*": [],
                  }}
                >
                  {data?.values[0]?.banner ? (
                    <LoadingImage
                      radius={"md"}
                      bg={"#000"}
                      height={280}
                      fit="cover"
                      imageId={data?.values[0]?.banner?.id}
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
                        <Text size="xl" inline>
                          Upload brand banner
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Only accept .png - .jpeg - .svg+xml - .gif file that are
                          less than 10mb in size
                        </Text>
                      </div>
                    </Group>
                  )}
                </Dropzone>
              </Tooltip>
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 3 }} mx={rem(20)} mb={50}>
            {/* Logo and brand info section */}
            <Box>
              <Tooltip label="Brand logo">
                <Dropzone
                  onDrop={(files) =>
                    handleUploadBrandImage(files, UploadBrandImageType.Logo)
                  }
                  onReject={(files) => console.log("rejected files", files)}
                  style={{ border: 0, backgroundColor: 'transparent', textAlign: 'center' }}
                  maxSize={5 * 1024 ** 2}
                  maxFiles={1}
                  accept={{
                    "image/*": [],
                  }}
                >
                  <Group justify="center">
                    {isUploadBrandLogoLoading ? (
                      <Skeleton height={200} circle />
                    ) : (
                      <Avatar
                        h={200}
                        w={200}
                        src={
                          data?.values[0]?.logo?.hostingUri ?? IMAGE_CONSTANT.NO_IMAGE
                        }
                        className={classes.avatar}
                      />
                    )}
                  </Group>
                </Dropzone>
              </Tooltip>
              <Text size="xl" fw={500} mb={rem(8)} ta="center">
                {data?.values[0]?.name ?? "No Data"}
              </Text>

              <Box mb={20}>
                <Flex mt={20}>
                  <Box mr={rem(8)}>
                    <IconMail width={20} />
                  </Box>
                  {data?.values[0]?.email ?? "No Data"}
                </Flex>
                <Flex>
                  <Box mr={rem(8)}>
                    <IconPhone width={20} />
                  </Box>
                  {data?.values[0]?.phone ?? "No Data"}
                </Flex>
                {data?.values[0]?.brandWebsite &&
                  <Flex>
                    <Box mr={rem(8)}>
                      <IconNetwork width={20} />
                    </Box>
                    <a href={"https://" + data?.values[0]?.brandWebsite} style={{ textDecoration: "none" }} target="_blank">
                      {data?.values[0]?.brandWebsite}
                    </a>
                  </Flex>
                }
              </Box>
              {data?.values[0]?.description &&
                <>
                  <Text fz={16} fw={'bold'} c={"grey"}>About</Text>
                  <Divider />
                  <Text mt={10} mb={20}>{data?.values[0]?.description}</Text>
                </>
              }
              <>
                <Text fz={16} fw={'bold'} c={"grey"}>Company</Text>
                <Divider />
                <Text mt={5} fw="bold">{data?.values[0]?.companyName}</Text>
                {/* <Text mt={5} fw="bold">{data?.values[0]?.companyAddress}</Text> */}
                {(data?.values[0]?.companyWard && data?.values[0]?.companyAddress) && <Text>{data?.values[0]?.companyAddress}, {data?.values[0]?.companyWard?.name}, {data?.values[0]?.companyWard?.district?.name}, {data?.values[0]?.companyWard?.district?.province?.name}</Text>}
                {(data?.values[0]?.companyWard && !data?.values[0]?.companyAddress) && <Text>{data?.values[0]?.companyWard?.name}, {data?.values[0]?.companyWard?.district?.name}, {data?.values[0]?.companyWard?.district?.province?.name}</Text>}
                {(!data?.values[0]?.companyWard && data?.values[0]?.companyAddress) && <Text>{data?.values[0]?.companyAddress}</Text>}
              </>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 8 }} mr={rem(32)}>
            <Text size="xl" fw={'bold'} c={"light-blue.4"} mb={rem(20)}>
              Shop List
            </Text>
            {/* Input and filter section */}
            <Flex align={"center"} mr={rem(32)}>
              {searchCategory == SearchCategory.NAME ? (
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Search Shop..."
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
                  placeholder="Search Shop..."
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

                h={rem(48)}
                onClick={() => {
                  navigate("/brand/create/shop");
                }}
                ml={rem(12)}
                radius={"20%/50%"}
                disabled={taskId != undefined}
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

            {/* Table section */}
            <Box mt={20}>
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
                  <Table striped highlightOnHover verticalSpacing={"md"}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>#</Table.Th>
                        <Table.Th>Shop name</Table.Th>
                        <Table.Th>Address</Table.Th>
                        <Table.Th>Open time</Table.Th>
                        <Table.Th>Close time</Table.Th>
                        <Table.Th>Phone</Table.Th>
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
              {!shopList?.isValuesEmpty &&
                <Select
                  label="Page Size"
                  allowDeselect={false}
                  placeholder="0"
                  data={PAGE_SIZE_SELECT} defaultValue={DEFAULT_PAGE_SIZE}
                  value={pageSize}
                  onChange={(value) => {
                    setPageSize(value)
                    setPage(1)
                  }}
                />
              }
            </Group>
          </Grid.Col>
        </Grid>
      }
    </Paper>
  );
};

export default BrandMainPage;
