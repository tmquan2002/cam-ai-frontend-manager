import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Menu,
  Paper,
  ScrollArea,
  Table,
  Text,
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
  IconAdjustments,
  IconArrowsLeftRight,
  IconX,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import clsx from "clsx";
import classes from "./ShopDetailPageManager.module.scss";
import { useParams } from "react-router-dom";
import { useGetShopById } from "../../hooks/useGetShopById";
import { replaceIfNun } from "../../utils/helperFunction";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import _ from "lodash";
import { IMAGE_CONSTANT } from "../../types/constant";
import { useChangeShopStatus } from "../../hooks/useChangeShopStatus";
import { ShopStatus } from "../../models/CamAIEnum";
import { modals } from "@mantine/modals";

export type FormFieldValue = {
  name: string;
  phone: string;
  province: string | null;
  district: string | null;
  wardId: string | null;
  addressLine: string;
  brandName: string;
};

const ShopDetailPageManager = () => {
  const [scrolled, setScrolled] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({ shopId: id });

  const { mutate: changeShopStatus, isLoading: isChangeShopStatusLoading } =
    useChangeShopStatus();

  const rows = employeeList?.values?.map((row) => (
    <Table.Tr
      style={{
        cursor: "pointer",
      }}
      key={row.id}
      // onClick={() => navigate(`/shop/employee/${row.id}`)}
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
      form.setValues(initialData);
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
            <Menu shadow="md">
              <Menu.Target>
                <ActionIcon
                  variant="filled"
                  aria-label="Settings"
                >
                  <IconAdjustments
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Modify</Menu.Label>
                {isChangeShopStatusLoading ? (
                  <Loader />
                ) : (
                  <Menu.Item
                    c={data?.shopStatus == ShopStatus.Active ? "red" : "green"}
                    onClick={() =>
                      openModal(data?.shopStatus ?? ShopStatus.Inactive)
                    }
                    leftSection={
                      <IconArrowsLeftRight
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    {data?.shopStatus == ShopStatus.Active
                      ? "Disable shop"
                      : "Enable shop"}
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
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
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
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

      <Paper
        p={rem(32)}
        m={rem(32)}
        shadow="xs"
      >
        <Text
          size="lg"
          fw={"bold"}
          fz={25}
          c={"light-blue.4"}
          pb={rem(28)}
        >
          Edge box
        </Text>

        <Flex>
          <Image
            radius={"md"}
            src={
              "https://cdn.dribbble.com/users/40756/screenshots/2917981/media/56fae174592893d88f6ca1be266aaaa6.png?resize=450x338&vertical=center"
            }
          />
          <Box ml={rem(40)}>
            <Text fw={500}>Model</Text>
            <Text fw={500}>Version</Text>
            <Text fw={500}>Status</Text>
            <Text fw={500}>Location</Text>
            <Text fw={500}>Type</Text>
          </Box>
        </Flex>
      </Paper>
    </Box>
  );
};

export default ShopDetailPageManager;
