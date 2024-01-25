import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Table,
  Text,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
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
import { IconPlus, IconX } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import clsx from "clsx";
import classes from "./ShopDetailPageManager.module.scss";
import { useParams } from "react-router-dom";
import { useGetShopById } from "../../hooks/useGetShopById";

const employee = [
  {
    name: "Athena Weissnat",
    company: "Little - Rippin",
    email: "Elouise.Prohaska@yahoo.com",
  },
  {
    name: "Deangelo Runolfsson",
    company: "Greenfelder - Krajcik",
    email: "Kadin_Trantow87@yahoo.com",
  },
  {
    name: "Danny Carter",
    company: "Kohler and Sons",
    email: "Marina3@hotmail.com",
  },
  {
    name: "Trace Tremblay PhD",
    company: "Crona, Aufderhar and Senger",
    email: "Antonina.Pouros@yahoo.com",
  },
  {
    name: "Derek Dibbert",
    company: "Gottlieb LLC",
    email: "Abagail29@hotmail.com",
  },
  {
    name: "Viola Bernhard",
    company: "Funk, Rohan and Kreiger",
    email: "Jamie23@hotmail.com",
  },
  {
    name: "Austin Jacobi",
    company: "Botsford - Corwin",
    email: "Genesis42@yahoo.com",
  },
  {
    name: "Hershel Mosciski",
    company: "Okuneva, Farrell and Kilback",
    email: "Idella.Stehr28@yahoo.com",
  },
  {
    name: "Mylene Ebert",
    company: "Kirlin and Sons",
    email: "Hildegard17@hotmail.com",
  },
  {
    name: "Lou Trantow",
    company: "Parisian - Lemke",
    email: "Hillard.Barrows1@hotmail.com",
  },
  {
    name: "Dariana Weimann",
    company: "Schowalter - Donnelly",
    email: "Colleen80@gmail.com",
  },
  {
    name: "Dr. Christy Herman",
    company: "VonRueden - Labadie",
    email: "Lilyan98@gmail.com",
  },
  {
    name: "Katelin Schuster",
    company: "Jacobson - Smitham",
    email: "Erich_Brekke76@gmail.com",
  },
  {
    name: "Melyna Macejkovic",
    company: "Schuster LLC",
    email: "Kylee4@yahoo.com",
  },
  {
    name: "Pinkie Rice",
    company: "Wolf, Trantow and Zulauf",
    email: "Fiona.Kutch@hotmail.com",
  },
  {
    name: "Brain Kreiger",
    company: "Lueilwitz Group",
    email: "Rico98@hotmail.com",
  },
  {
    name: "Myrtice McGlynn",
    company: "Feest, Beahan and Johnston",
    email: "Julius_Tremblay29@hotmail.com",
  },
  {
    name: "Chester Carter PhD",
    company: "Gaylord - Labadie",
    email: "Jensen_McKenzie@hotmail.com",
  },
  {
    name: "Mrs. Ericka Bahringer",
    company: "Conn and Sons",
    email: "Lisandro56@hotmail.com",
  },
  {
    name: "Korbin Buckridge Sr.",
    company: "Mraz, Rolfson and Predovic",
    email: "Leatha9@yahoo.com",
  },
  {
    name: "Dr. Daisy Becker",
    company: "Carter - Mueller",
    email: "Keaton_Sanford27@gmail.com",
  },
  {
    name: "Derrick Buckridge Sr.",
    company: "O'Reilly LLC",
    email: "Kay83@yahoo.com",
  },
  {
    name: "Ernie Hickle",
    company: "Terry, O'Reilly and Farrell",
    email: "Americo.Leffler89@gmail.com",
  },
  {
    name: "Jewell Littel",
    company: "O'Connell Group",
    email: "Hester.Hettinger9@hotmail.com",
  },
];

export type FormFieldValue = {
  name: string;
  phone: string;
  province: string;
  district: string;
  wardId: string;
  addressLine: string;
  brandName: string;
};

const ShopDetailPageManager = () => {
  const [scrolled, setScrolled] = useState(false);
  const { id } = useParams<{ id: string }>();

  const rows = employee?.map((row) => (
    <Table.Tr
      style={{
        cursor: "pointer",
      }}
      key={row.name}
    >
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.company}</Table.Td>
    </Table.Tr>
  ));

  const form = useForm<FormFieldValue>({
    initialValues: {
      name: "",
      phone: "",
      wardId: "0",
      addressLine: "",
      brandName: "",
      province: "0",
      district: "0",
    },
  });
  const { data, isLoading } = useGetShopById(id ?? "0");
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +form.values.province
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +form.values.district
  );
  const { mutate: updateShop, isLoading: updateShopLoading } =
    useUpdateShopById();

  useEffect(() => {
    if (data) {
      const initialData: FormFieldValue = {
        name: data.name,
        phone: data.phone,
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
          searchable: true,
          name: "province",
          loading: isProvicesLoading,
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
        <Box pos="relative">
          <LoadingOverlay
            visible={isLoading || updateShopLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          <form
            onSubmit={form.onSubmit((values) => {
              const updateShopParams: UpdateShopParams = {
                shopId: data?.id ?? "0",
                addressLine: values.addressLine,
                wardId: values.wardId,
                name: values.name,
                phone: values.phone,
              };

              updateShop(updateShopParams, {
                onSuccess() {
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
              fw={500}
              size="lg"
              pb={rem(28)}
            >
              {data?.name}
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
            fw={500}
            size="lg"
          >
            Employee
          </Text>
          <Button leftSection={<IconPlus size={14} />}>Add Employee</Button>
        </Flex>
        <ScrollArea
          h={300}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table
            miw={700}
            highlightOnHover
          >
            <Table.Thead
              className={clsx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Company</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      <Paper
        p={rem(32)}
        m={rem(32)}
        shadow="xs"
      >
        <Text
          fw={500}
          size="lg"
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
