import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Paper,
  ScrollArea,
  SimpleGrid,
  Table,
  Text,
  Tooltip,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useGetShopList } from "../../hooks/useGetShopList";
import { notifications } from "@mantine/notifications";
import { useUpdateShopById } from "../../hooks/useUpdateShopById";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { UpdateShopParams } from "../../apis/ShopAPI";
import {
  IconAlertCircle,
  IconCaretRight,
  IconMapPin,
  IconPlus,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import clsx from "clsx";
import classes from "./ShopDetailPage.module.scss";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { replaceIfNun } from "../../utils/helperFunction";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import {
  EdgeBoxActivationStatus,
  EdgeBoxLocation,
  EdgeBoxStatus,
  EdgeboxInstallStatus,
} from "../../models/CamAIEnum";
import { useGetEdgeBoxInstallByShopId } from "../../hooks/useGetEdgeBoxInstallByShopId";
import { EdgeBoxInstallDetail } from "../../models/Edgebox";
import { useGetCameraListByShopId } from "../../hooks/useGetCameraListByShopId";

export type FormFieldValue = {
  name: string;
  phone: string;
  province: string | null;
  district: string | null;
  wardId: string | null;
  addressLine: string;
  brandName: string;
  openTime: string;
  closeTime: string;
};

const renderEdgeBoxActivationStatusBadge = (
  status: EdgeBoxActivationStatus | undefined
) => {
  switch (status) {
    case EdgeBoxActivationStatus.Activated:
      return <Badge color="green">{EdgeBoxActivationStatus.Activated}</Badge>;
    case EdgeBoxActivationStatus.Pending:
      return <Badge color={"orange"}>{EdgeBoxActivationStatus.Pending}</Badge>;
    case EdgeBoxActivationStatus.NotActivated:
      return <Badge color={"gray"}>INACTIVE</Badge>;
    case EdgeBoxActivationStatus.Failed:
      return <Badge color={"red"}>{EdgeBoxActivationStatus.Failed}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const renderEdboxStatusBadge = (status: EdgeBoxStatus | undefined) => {
  switch (status) {
    case EdgeBoxStatus.Active:
      return <Badge color="green">{EdgeBoxStatus.Active}</Badge>;
    case EdgeBoxStatus.Broken:
      return <Badge color={"orange"}>{EdgeBoxStatus.Active}</Badge>;
    case EdgeBoxStatus.Inactive:
      return <Badge color={"red"}>{EdgeBoxStatus.Active}</Badge>;
    case EdgeBoxStatus.Disposed:
      return <Badge color={"gray"}>{EdgeBoxStatus.Disposed}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const renderEdgeboxInstallStatusBadge = (
  status: EdgeboxInstallStatus | undefined
) => {
  switch (status) {
    case EdgeboxInstallStatus.Working:
      return <Badge color="green">{EdgeboxInstallStatus.Working}</Badge>;
    case EdgeboxInstallStatus.Unhealthy:
      return <Badge color={"yellow"}>{EdgeboxInstallStatus.Unhealthy}</Badge>;
    case EdgeboxInstallStatus.Disabled:
      return <Badge color={"gray"}>{EdgeboxInstallStatus.Disabled}</Badge>;
    case EdgeboxInstallStatus.New:
      return <Badge color={"blue"}>{EdgeboxInstallStatus.New}</Badge>;
    case EdgeboxInstallStatus.Connected:
      return <Badge color={"teal"}>{EdgeboxInstallStatus.Connected}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const renderEdboxLocationBadge = (location: EdgeBoxLocation | undefined) => {
  switch (location) {
    case EdgeBoxLocation.Disposed:
      return <Badge color="teal">{EdgeBoxLocation.Disposed}</Badge>;
    case EdgeBoxLocation.Idle:
      return <Badge color={"blue"}>{EdgeBoxLocation.Idle}</Badge>;
    case EdgeBoxLocation.Installing:
      return <Badge color={"yellow"}>{EdgeBoxLocation.Installing}</Badge>;
    case EdgeBoxLocation.Occupied:
      return <Badge color={"green"}>{EdgeBoxLocation.Occupied}</Badge>;
    case EdgeBoxLocation.Uninstalling:
      return <Badge color={"orange"}>{EdgeBoxLocation.Uninstalling}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const renderEdgeboxList = (
  edgeBoxInstallList: EdgeBoxInstallDetail[] | undefined
) => {
  if (edgeBoxInstallList && edgeBoxInstallList.length > 0) {
    return (
      <Paper p={rem(32)} m={rem(32)} shadow="xs">
        <Group align="center" pb={rem(28)} gap={"sm"}>
          <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"} mr={"sm"}>
            Edge Box
          </Text>
        </Group>
        <Flex>
          <Image
            radius={"md"}
            src={
              "https://cdn.dribbble.com/users/40756/screenshots/2917981/media/56fae174592893d88f6ca1be266aaaa6.png?resize=450x338&vertical=center"
            }
          />
          <Box ml={rem(40)} style={{ flex: 1 }}>
            <Group gap={rem(40)}>
              <Box>
                <Text fw={500} c={"dimmed"}>
                  Name
                </Text>
                <Text fw={500}>{edgeBoxInstallList?.[0].edgeBox.name}</Text>
              </Box>
              <Box>
                <Text fw={500} c={"dimmed"}>
                  Active status
                </Text>
                {renderEdboxStatusBadge(
                  edgeBoxInstallList?.[0].edgeBox.edgeBoxStatus
                )}
              </Box>

              <Box>
                <Text fw={500} c={"dimmed"}>
                  EdgeBox location
                </Text>
                {renderEdboxLocationBadge(
                  edgeBoxInstallList?.[0].edgeBox.edgeBoxLocation
                )}
              </Box>
              <Box>
                <Text fw={500} c={"dimmed"}>
                  Activation status
                </Text>
                {renderEdgeBoxActivationStatusBadge(
                  edgeBoxInstallList?.[0].activationStatus
                )}
              </Box>
              <Box>
                <Text fw={500} c={"dimmed"}>
                  Install status
                </Text>
                {renderEdgeboxInstallStatusBadge(
                  edgeBoxInstallList?.[0].edgeBoxInstallStatus
                )}
              </Box>
            </Group>
            <Divider my={rem(20)} />
            <Group>
              <Text miw={rem(120)} fw={600}>
                Description :
              </Text>
              <Text>
                {edgeBoxInstallList?.[0]?.edgeBox?.edgeBoxModel?.description}
              </Text>
            </Group>
            <Divider my={rem(20)} />
            <SimpleGrid cols={2}>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  Model name :
                </Text>
                <Text>
                  {edgeBoxInstallList?.[0]?.edgeBox?.edgeBoxModel?.name}
                </Text>
              </Group>

              <Group>
                <Text miw={rem(120)} fw={600}>
                  Model code :
                </Text>
                <Text>
                  {edgeBoxInstallList?.[0]?.edgeBox?.edgeBoxModel?.modelCode}
                </Text>
              </Group>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  Manufacturer :
                </Text>
                <Text>
                  {edgeBoxInstallList?.[0]?.edgeBox?.edgeBoxModel?.manufacturer}
                </Text>
              </Group>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  CPU :
                </Text>
                <Text>
                  {edgeBoxInstallList?.[0]?.edgeBox?.edgeBoxModel?.cpu}
                </Text>
              </Group>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  RAM :
                </Text>
                <Text>
                  {edgeBoxInstallList?.[0]?.edgeBox?.edgeBoxModel?.ram}
                </Text>
              </Group>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  Storage :
                </Text>
                <Text>
                  {edgeBoxInstallList?.[0]?.edgeBox?.edgeBoxModel?.storage}
                </Text>
              </Group>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  OS :
                </Text>
                <Text>
                  {edgeBoxInstallList?.[0]?.edgeBox?.edgeBoxModel?.os}
                </Text>
              </Group>
            </SimpleGrid>
          </Box>
        </Flex>
      </Paper>
    );
  }

  return (
    <Paper p={rem(32)} m={rem(32)} shadow="xs">
      <Group align="center" pb={rem(28)} gap={"sm"}>
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"} mr={"sm"}>
          Edge Box
        </Text>
      </Group>
      <Flex>
        <Image
          radius={"md"}
          src={
            "https://cdn.dribbble.com/users/40756/screenshots/2917981/media/56fae174592893d88f6ca1be266aaaa6.png?resize=450x338&vertical=center"
          }
        />
        <Box ml={rem(40)} style={{ flex: 1 }}>
          <Text>No edgebox available</Text>
        </Box>
      </Flex>
    </Paper>
  );
};

const ShopDetailPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormFieldValue>({
    validate: {
      name: isNotEmpty("Name should not be empty"),
      phone: (value) =>
        value == "" || /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)
          ? null
          : "Invalid phone number - ex: 0379999999",
      addressLine: isNotEmpty("Address should not be empty"),
      wardId: isNotEmpty("Please select ward"),
      province: isNotEmpty("Provice is required"),
      district: isNotEmpty("District is required"),
      openTime: isNotEmpty("Open time is required"),
      closeTime: isNotEmpty("Close time is required"),
    },
  });
  const { data, isLoading } = useGetShopList({ size: 1, enabled: true });
  const { data: edgeBoxInstallList, isLoading: isEdgeboxInstallListLoading } =
    useGetEdgeBoxInstallByShopId(data?.values?.[0]?.id ?? null);
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();

  const { data: cameraList, isLoading: isGetCameraListLoading } =
    useGetCameraListByShopId(data?.values?.[0]?.id ?? undefined);

  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(form.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(form.values.district ?? 0)
  );
  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({});
  const { mutate: updateShop, isLoading: updateShopLoading } =
    useUpdateShopById();

  const rows = employeeList?.values?.map((row) => (
    <Table.Tr
      style={{
        cursor: "pointer",
      }}
      key={row.id}
      onClick={() => navigate(`/shop/employee/${row.id}`)}
    >
      <Table.Td>{replaceIfNun(row.name)}</Table.Td>
      <Table.Td>{replaceIfNun(row.email)}</Table.Td>
      <Table.Td>{replaceIfNun(row.phone)}</Table.Td>
      <Table.Td>{replaceIfNun(row.birthday)}</Table.Td>
      <Table.Td>{replaceIfNun(row.gender)}</Table.Td>
      <Table.Td>{replaceIfNun(row.addressLine)}</Table.Td>
      <Table.Td>
        {_.isEqual(row.employeeStatus, "Active") ? (
          <Badge variant="light">Active</Badge>
        ) : (
          <Badge color="gray" variant="light">
            Disabled
          </Badge>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    if (data) {
      const { values } = data;
      if (!_.isEmpty(values)) {
        const initialData: FormFieldValue = {
          name: values[0]?.name,
          phone: values[0]?.phone,
          wardId: `${values[0]?.wardId}`,
          addressLine: values[0]?.addressLine,
          brandName: values[0]?.brand.name,
          province: `${values[0]?.ward?.district?.province?.id}`,
          district: `${values[0]?.ward?.district?.id}`,
          openTime: values[0]?.openTime,
          closeTime: values[0]?.closeTime,
        };
        form.setInitialValues(initialData);
        form.reset();
      }
    }
  }, [data]);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          readonly: true,
          form,
          name: "name",
          placeholder: "Shop name",
          label: "Shop name",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          readonly: true,
          form,
          name: "phone",
          placeholder: "Shop phone",
          label: "Shop phone",
        },
      },

      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          readonly: true,
          form,
          name: "brandName",
          placeholder: "Brand",
          label: "Shop",
          disabled: true,
        },
      },
      {
        type: FIELD_TYPES.TIME,
        fieldProps: {
          readonly: true,
          form,
          name: "openTime",
          placeholder: "Open Time",
          label: "Open time",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TIME,
        fieldProps: {
          readonly: true,
          form,
          name: "closeTime",
          placeholder: "Close Time",
          label: "Close time",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          readonly: true,
          label: "Province",
          placeholder: "Province",
          data: provinces?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,

          name: "province",
          loading: isProvicesLoading,
          required: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          readonly: true,
          label: "District",
          placeholder: "District",
          data: districts?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          name: "district",
          loading: isDistrictsLoading,
          required: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          readonly: true,
          label: "Ward",
          placeholder: "Ward",
          data: wards?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          name: "wardId",
          loading: isWardsLoading,
          required: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          readonly: true,
          form,
          name: "addressLine",
          placeholder: "Shop address",
          label: "Shop address",
          required: true,
        },
      },
    ];
  }, [
    form,
    provinces,
    districts,
    wards,
    isProvicesLoading,
    isDistrictsLoading,
    isWardsLoading,
  ]);

  return (
    <Box pb={20}>
      <Paper p={rem(32)} m={rem(32)} shadow="xs">
        <Box pos="relative">
          <LoadingOverlay
            visible={isLoading || updateShopLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          <form
            onSubmit={form.onSubmit((values) => {
              const updateShopParams: UpdateShopParams = {
                shopId: data?.values[0].id ?? "0",
                addressLine: values.addressLine,
                wardId: values.wardId ?? "0",
                name: values.name,
                phone: values.phone,
                openTime: values?.openTime,
                closeTime: values?.closeTime,
              };

              updateShop(updateShopParams, {
                onSuccess() {
                  // onSuccess(data) {
                  notifications.show({
                    title: "Update successfully",
                    message: "Shop detail updated!",
                  });
                },
                onError(data) {
                  const error = data as AxiosError<ResponseErrorDetail>;
                  notifications.show({
                    color: "red",
                    icon: <IconX />,
                    title: "Update failed",
                    message: error.response?.data?.message,
                  });
                },
              });
            })}
          >
            <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"} mb={20}>
              SHOP DETAIL
            </Text>
            <EditAndUpdateForm fields={fields} />

            <Group justify="flex-end" mt="md">
              {/* <Button
                type="submit"
                disabled={!form.isDirty()}
              >
                Submit
              </Button> */}
            </Group>
          </form>
        </Box>
      </Paper>

      <Paper p={rem(32)} m={rem(32)} shadow="xs">
        <Text size="lg" fw={"bold"} fz={25} mb={rem(20)} c={"light-blue.4"}>
          Camera list
        </Text>
        {isGetCameraListLoading ? (
          <Loader />
        ) : (
          cameraList?.values?.map((item) => (
            <Tooltip label="View camera" key={item?.id}>
              <Button
                variant="outline"
                fullWidth
                size={rem(52)}
                justify="space-between"
                onClick={() => navigate(`/shop/camera/${item?.id}`)}
                rightSection={<IconCaretRight style={{ width: rem(24) }} />}
                px={rem(16)}
                mb={rem(16)}
              >
                <Group>
                  <Group mr={rem(20)}>
                    <IconVideo style={{ width: rem(20) }} />
                    <Text key={item?.id}> {item?.name}</Text>
                  </Group>
                  <Group mr={rem(20)}>
                    <IconMapPin style={{ width: rem(20) }} />
                    <Text key={item?.id}> {item?.zone}</Text>
                  </Group>
                  <Group>
                    <IconAlertCircle style={{ width: rem(20) }} />
                    <Text key={item?.id}> {item?.status}</Text>
                  </Group>
                </Group>
              </Button>
            </Tooltip>
          ))
        )}
      </Paper>

      <Paper p={rem(32)} m={rem(32)} shadow="xs">
        <Flex pb={rem(28)} justify={"space-between "}>
          <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
            Employee
          </Text>
          <Button
            onClick={() => navigate("/shop/employee/create")}
            leftSection={<IconPlus size={14} />}
          >
            Add Employee
          </Button>
        </Flex>
        {isGetEmployeeListLoading ? (
          <Loader />
        ) : (
          <ScrollArea onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table miw={1000} highlightOnHover verticalSpacing={"md"} striped>
              <Table.Thead
                className={clsx(classes.header, {
                  [classes.scrolled]: scrolled,
                })}
              >
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Phone</Table.Th>
                  <Table.Th>Birthday</Table.Th>
                  <Table.Th>Gender</Table.Th>
                  <Table.Th>Address</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Paper>

      {isEdgeboxInstallListLoading ? (
        <Loader />
      ) : (
        renderEdgeboxList(edgeBoxInstallList?.values)
      )}
    </Box>
  );
};

export default ShopDetailPage;
