import {
  Badge,
  // ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Table,
  Text,
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
import { IconPlus, IconX } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import clsx from "clsx";
import classes from "./ShopDetailPage.module.scss";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import ReactPlayer from "react-player";
import { replaceIfNun } from "../../utils/helperFunction";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

export type FormFieldValue = {
  name: string;
  phone: string;
  province: string | null;
  district: string | null;
  wardId: string | null;
  addressLine: string;
  brandName: string;
};

const ShopDetailPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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
      name: isNotEmpty("Name should not be empty"),
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
  const { data, isLoading } = useGetShopList({ size: 1, enabled: true });
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
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
        {_.isEqual(row.employeeStatus.name, "Active") ? (
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

  useEffect(() => {
    if (data) {
      const { values } = data;
      const initialData: FormFieldValue = {
        name: values[0].name,
        phone: values[0].phone,
        wardId: `${values[0].wardId}`,
        addressLine: values[0].addressLine,
        brandName: values[0].brand.name,
        province: `${values[0].ward?.district?.province?.id}`,
        district: `${values[0].ward?.district?.id}`,
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
          label: "Shop",
          disabled: true,
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
      >
        <ReactPlayer
          // playing
          width={"1082px"}
          height={"720px"}
          url={[
            { src: "/video2.mp4", type: "audio/mp4" },
            // { src: "foo.ogg", type: "video/ogg" },
          ]}
          controls
        />
      </Paper>
      <Paper
        p={rem(32)}
        m={rem(32)}
        shadow="xs"
      >
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
            <Text
              size="lg"
              fw={"bold"}
              fz={25}
              c={"light-blue.4"}
              mb={20}
            >
              SHOP DETAIL
            </Text>
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
          pb={rem(28)}
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
            <Table
              miw={1000}
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
          fz={20}
          c={"light-blue.4"}
          mb={10}
        >
          Edge Box
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

export default ShopDetailPage;
