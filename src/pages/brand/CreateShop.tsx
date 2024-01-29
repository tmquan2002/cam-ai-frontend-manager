import { Button, Group, Paper, Text, rem } from "@mantine/core";
import { useMemo } from "react";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useForm } from "@mantine/form";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetWardList } from "../../hooks/useGetWardList";

export type CreateShopField = {
  name: string;
  phone: string;
  wardId: string;
  brandId: string;
  shopManagerId: string;
  addressLine: string;
  province: string;
  district: string;
};

const CreateShop = () => {
  const form = useForm<CreateShopField>({
    initialValues: {
      name: "",
      phone: "",
      wardId: "0",
      brandId: "",
      shopManagerId: "",
      addressLine: "",
      province: "0",
      district: "0",
    },
  });
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +form.values.province
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +form.values.district
  );

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
    districts,
    form,
    isDistrictsLoading,
    isProvicesLoading,
    isWardsLoading,
    provinces,
    wards,
  ]);
  return (
    <Paper
      m={rem(32)}
      p={rem(32)}
    >
      <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>ADD NEW SHOP</Text>
      <form action="">
        <EditAndUpdateForm fields={fields} />
        <Group
          justify="flex-end"
          mt="md"
        >
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Paper>
  );
};

export default CreateShop;
