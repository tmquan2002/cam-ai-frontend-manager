import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Tooltip,
  rem,
} from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { notifications } from "@mantine/notifications";
import { useUpdateShopById } from "../../hooks/useUpdateShopById";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { UpdateShopParams } from "../../apis/ShopAPI";
import {
  IconMail,
  IconRepeat,
  IconTrash,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import clsx from "clsx";
import classes from "./ShopDetailPageManager.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useGetShopById } from "../../hooks/useGetShopById";
import { replaceIfNun } from "../../utils/helperFunction";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import _ from "lodash";
import { IMAGE_CONSTANT } from "../../types/constant";
import { useChangeShopStatus } from "../../hooks/useChangeShopStatus";
import {
  EdgeBoxLocation,
  EdgeBoxStatus,
  EdgeboxInstallStatus,
  ShopStatus,
} from "../../models/CamAIEnum";
import { modals } from "@mantine/modals";
import { IconCaretRight } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useGetAccountList } from "../../hooks/useGetAccounts";
import { useGetEdgeBoxInstallByShopId } from "../../hooks/useGetEdgeBoxInstallByShopId";
import BackButton from "../../components/button/BackButton";

export type FormFieldValue = {
  name: string;
  phone: string;
  province: string | null;
  district: string | null;
  wardId: string | null;
  addressLine: string;
  brandName: string;
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

const ShopDetailPageManager = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [opened, { toggle }] = useDisclosure(false);
  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({ shopId: id });

  const { mutate: changeShopStatus, isLoading: isChangeShopStatusLoading } =
    useChangeShopStatus();

  const { data: edgeBoxInstallList, isLoading: isEdgeboxInstallListLoading } =
    useGetEdgeBoxInstallByShopId(id ?? "");

  const rows = employeeList?.values?.map((row) => (
    <Table.Tr
      style={{
        cursor: "pointer",
      }}
      key={row.id}
      onClick={() => navigate(`/brand/employee/${row.id}`)}
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
          <Badge
            color="gray"
            variant="light"
          >
            Disabled
          </Badge>
        )}
      </Table.Td>
    </Table.Tr>
  ));
  const form = useForm<FormFieldValue>({
    initialValues: {
      name: "",
      phone: "",
      wardId: null,
      addressLine: "",
      brandName: "",
      district: null,
      province: null,
    },
    validate: {
      name: hasLength(
        { min: 2, max: 50 },
        "Shop name must be 1- 50 characters long"
      ),
      phone: (value) =>
        value == "" || /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)
          ? null
          : "Invalid phone number - ex: 0379999999",
      addressLine: isNotEmpty("Address should not be empty"),
      wardId: isNotEmpty("Please select ward"),
      province: isNotEmpty("Provice is required"),
      district: isNotEmpty("District is required"),
    },
  });
  const { data, isLoading, refetch } = useGetShopById(id ?? "0");
  const { data: accountList, isLoading: isAccountListLoading } =
    useGetAccountList({});
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(form.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(form.values.district ?? 0)
  );
  const { mutate: updateShop, isLoading: updateShopLoading } =
    useUpdateShopById();

  const handleToggleShopStatus = (currentStatus: ShopStatus) => {
    changeShopStatus(
      {
        shopId: id ?? "",
        status:
          currentStatus == ShopStatus.Active
            ? ShopStatus.Inactive
            : ShopStatus.Active,
      },
      {
        onSuccess() {
          notifications.show({
            title: "Successfully",
            message: "Update shop successfully!",
          });
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
  };

  const openModal = (currentStatus: ShopStatus) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Do you really want to{" "}
          {currentStatus == ShopStatus.Active ? "Disable" : "Enable"} this shop!
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => {},
      onConfirm: () => handleToggleShopStatus(currentStatus),
    });

  const accountListItem = accountList?.values.map((item) => (
    <Accordion.Item
      value={item.id}
      key={item.id}
    >
      <Accordion.Control disabled={item?.managingShop != null}>
        <Group wrap="nowrap">
          <div>
            <Text>{item.name}</Text>
            <Text
              size="sm"
              c="dimmed"
              fw={400}
            >
              {item.email}
            </Text>
          </div>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Group justify="flex-end">
          <Button
            onClick={() => {
              const params: UpdateShopParams = {
                shopId: id ?? "",
                addressLine: data?.addressLine ?? undefined,
                name: data?.name,
                phone: data?.phone ?? null,
                shopManagerId: item?.id,
                wardId: data?.wardId ? data?.wardId.toString() : undefined,
              };
              updateShop(params, {
                onSuccess() {
                  notifications.show({
                    title: "Assign account successfully",
                    message: "Shop updated!",
                  });
                  refetch();
                  toggle();
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
            }}
          >
            Assign this account to shop
          </Button>
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  useEffect(() => {
    if (data) {
      const initialData: FormFieldValue = {
        name: data.name,
        phone: data?.phone ?? "",
        wardId: `${data.wardId}`,
        addressLine: data.addressLine,
        brandName: data.brand.name,
        province: `${data.ward.district.province.id}`,
        district: `${data.ward.district.id}`,
      };
      form.setInitialValues(initialData);
      form.reset();
    }
  }, [data]);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
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
          form,
          name: "phone",
          placeholder: "Shop phone",
          label: "Shop phone",
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "addressLine",
          placeholder: "Shop address",
          label: "Shop address",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "brandName",
          placeholder: "Brand",
          label: "Brand",
          readonly: true,
        },
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
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
      <Paper
        p={rem(32)}
        m={rem(32)}
        shadow="xs"
        pos="relative"
      >
        <LoadingOverlay
          visible={isLoading || updateShopLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Box>
          <Group
            justify="space-between"
            pb={rem(20)}
          >
            <Group align="center">
              <BackButton />
              <Text
                size="lg"
                fw={"bold"}
                fz={25}
                c={"light-blue.4"}
              >
                {data?.name}
              </Text>
              <Badge
                mt={rem(6)}
                color={data?.shopStatus == ShopStatus.Active ? "green" : "red"}
              >
                {data?.shopStatus}
              </Badge>
            </Group>

            {isChangeShopStatusLoading ? (
              <Loader />
            ) : (
              <ActionIcon
                color={data?.shopStatus == ShopStatus.Active ? "red" : "green"}
                onClick={() =>
                  openModal(data?.shopStatus ?? ShopStatus.Inactive)
                }
              >
                {data?.shopStatus == ShopStatus.Active ? (
                  <IconTrash style={{ width: rem(16), height: rem(16) }} />
                ) : (
                  <IconRepeat style={{ width: rem(16), height: rem(16) }} />
                )}
              </ActionIcon>
            )}
          </Group>
          <form
            onSubmit={form.onSubmit((values) => {
              const updateShopParams: UpdateShopParams = {
                shopId: data?.id ?? "0",
                addressLine: values.addressLine,
                wardId: values.wardId ?? "0",
                name: values.name,
                phone: values.phone == "" ? null : values.phone,
              };

              updateShop(updateShopParams, {
                onSuccess() {
                  notifications.show({
                    title: "Update successfully",
                    message: "Shop detail updated!",
                  });
                  refetch();
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
            <EditAndUpdateForm fields={fields} />

            <Group
              justify="flex-end"
              mt="md"
            >
              <Button
                disabled={!form.isDirty()}
                type="submit"
              >
                Submit
              </Button>
            </Group>
          </form>
        </Box>
      </Paper>

      <Paper
        p={rem(32)}
        m={rem(32)}
        shadow="xs"
      >
        <Group pb={rem(20)}>
          <Text
            size="lg"
            fw={"bold"}
            fz={25}
            c={"light-blue.4"}
          >
            Shop manager
          </Text>
        </Group>

        {isAccountListLoading ? (
          <Loader />
        ) : (
          <Button
            onClick={toggle}
            rightSection={<IconCaretRight />}
            variant="light"
            fullWidth
            autoContrast
            justify="space-between"
            size="xl"
            px={rem(16)}
          >
            <Stack
              align="flex-start"
              justify="flex-start"
              gap={0}
              className={classes["pointer-style"]}
              onClick={() =>
                navigate(`/brand/account/${data?.shopManager?.id}`)
              }
            >
              {data?.shopManager ? (
                <>
                  <Group>
                    <IconUser className={classes.icon} />

                    <Text size="lg">{data?.shopManager?.name}</Text>
                  </Group>
                  <Group>
                    <IconMail className={classes.icon} />

                    <Text
                      size="sm"
                      c={"dimmed"}
                      fw={400}
                    >
                      {data?.shopManager?.email}
                    </Text>
                  </Group>
                </>
              ) : (
                <Text size="lg">Assign a shop manager to this shop</Text>
              )}
            </Stack>
          </Button>
        )}

        <Collapse in={opened}>
          <Accordion
            chevronPosition="right"
            variant="contained"
          >
            {accountListItem}
          </Accordion>
        </Collapse>
      </Paper>

      <Paper
        p={rem(32)}
        m={rem(32)}
        shadow="xs"
      >
        <Flex
          pb={rem(20)}
          justify={"space-between "}
        >
          <Text
            size="lg"
            fw={"bold"}
            fz={25}
            c={"light-blue.4"}
          >
            Employee
          </Text>
        </Flex>
        {isGetEmployeeListLoading ? (
          <Loader />
        ) : (
          <ScrollArea onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
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
              <Table
                highlightOnHover
                verticalSpacing={"md"}
                striped
              >
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
            )}
          </ScrollArea>
        )}
      </Paper>
      {isEdgeboxInstallListLoading ? (
        <Loader />
      ) : (
        <Paper
          p={rem(32)}
          m={rem(32)}
          shadow="xs"
        >
          <Group
            align="center"
            pb={rem(28)}
            gap={"sm"}
          >
            <Text
              size="lg"
              fw={"bold"}
              fz={25}
              c={"light-blue.4"}
            >
              Edge box
            </Text>
            <Tooltip
              label="Edgebox install status"
              transitionProps={{ transition: "slide-up", duration: 300 }}
            >
              {renderEdgeboxInstallStatusBadge(
                edgeBoxInstallList?.[0]?.edgeBoxInstallStatus
              )}
            </Tooltip>
            <Tooltip
              label="Edgebox status"
              transitionProps={{ transition: "slide-up", duration: 300 }}
            >
              {renderEdboxStatusBadge(
                edgeBoxInstallList?.[0]?.edgeBox.edgeBoxStatus
              )}
            </Tooltip>
            <Tooltip
              label="Edgebox location"
              transitionProps={{ transition: "slide-up", duration: 300 }}
            >
              {renderEdboxLocationBadge(
                edgeBoxInstallList?.[0]?.edgeBox.edgeBoxLocation
              )}
            </Tooltip>
          </Group>
        </Paper>
      )}
    </Box>
  );
};

export default ShopDetailPageManager;
